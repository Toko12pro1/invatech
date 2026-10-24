-- Product-aware referral attribution and auditable reward payment details.
-- A referral is only rewardable when its code belongs to a registered account
-- and Innovatech confirms the purchase proof.

alter table public.consultation_requests
  add column if not exists product_id uuid references public.products(id) on delete set null,
  add column if not exists referrer_id uuid references auth.users(id) on delete set null;

create index if not exists consultation_requests_product_idx
  on public.consultation_requests(product_id, created_at desc);

create index if not exists consultation_requests_referrer_idx
  on public.consultation_requests(referrer_id, created_at desc)
  where referrer_id is not null;

-- Keep this aligned with the existing admin policy convention in this app:
-- authenticated staff accounts can review the request context needed to settle a proof.
drop policy if exists "Authenticated team can review consultation requests" on public.consultation_requests;
create policy "Authenticated team can review consultation requests"
  on public.consultation_requests for select
  using (auth.role() = 'authenticated');

alter table public.referral_events
  add column if not exists product_id uuid references public.products(id) on delete set null,
  add column if not exists consultation_request_id uuid references public.consultation_requests(id) on delete set null;

create unique index if not exists referral_events_consultation_request_idx
  on public.referral_events(consultation_request_id)
  where consultation_request_id is not null;

drop policy if exists "Authenticated team can review referral profiles" on public.referral_profiles;
create policy "Authenticated team can review referral profiles"
  on public.referral_profiles for select
  using (auth.role() = 'authenticated');

alter table public.purchase_proofs
  add column if not exists reward_paid_at timestamptz,
  add column if not exists reward_payment_method text
    check (reward_payment_method is null or reward_payment_method in ('mobile_money', 'cash', 'bank_transfer', 'other')),
  add column if not exists reward_payment_reference text;

create or replace function public.normalize_consultation_referral()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.referral_code is null or btrim(new.referral_code) = '' then
    new.referral_code := null;
    new.referrer_id := null;
    return new;
  end if;

  new.referral_code := upper(btrim(new.referral_code));
  select id
    into new.referrer_id
    from public.referral_profiles
    where referral_code = new.referral_code;

  return new;
end;
$$;

drop trigger if exists consultation_requests_normalize_referral on public.consultation_requests;
create trigger consultation_requests_normalize_referral
  before insert or update of referral_code on public.consultation_requests
  for each row execute function public.normalize_consultation_referral();

create or replace function public.create_referral_event_from_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.request_type <> 'purchase_trace' or new.referrer_id is null then
    return new;
  end if;

  insert into public.referral_events (
    referrer_id,
    referral_code,
    referred_name,
    referred_phone,
    order_reference,
    product_id,
    consultation_request_id,
    status,
    reward_amount
  )
  values (
    new.referrer_id,
    new.referral_code,
    new.customer_name,
    new.phone,
    new.tracking_reference,
    new.product_id,
    new.id,
    'pending',
    0
  )
  on conflict (consultation_request_id) do update set
    referrer_id = excluded.referrer_id,
    referral_code = excluded.referral_code,
    referred_name = excluded.referred_name,
    referred_phone = excluded.referred_phone,
    order_reference = excluded.order_reference,
    product_id = excluded.product_id,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists consultation_requests_create_referral_event on public.consultation_requests;
create trigger consultation_requests_create_referral_event
  after insert or update of referral_code, referrer_id, product_id on public.consultation_requests
  for each row execute function public.create_referral_event_from_request();

create or replace function public.protect_purchase_reward_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.reward_status = 'paid' and new.reward_status <> 'paid' then
    raise exception 'A paid referral reward cannot be moved back to another status';
  end if;

  if new.reward_status = 'paid' then
    if new.status <> 'confirmed' then
      raise exception 'Confirm the purchase proof before marking the reward paid';
    end if;
    if coalesce(new.reward_amount, 0) <= 0 then
      raise exception 'Enter a reward amount before marking the reward paid';
    end if;
    if btrim(coalesce(new.reward_payment_method, '')) = '' then
      raise exception 'Select a reward payment method before marking the reward paid';
    end if;
    if btrim(coalesce(new.reward_payment_reference, '')) = '' then
      raise exception 'Enter a payment reference before marking the reward paid';
    end if;
    new.reward_paid_at := coalesce(new.reward_paid_at, now());
  end if;

  return new;
end;
$$;

drop trigger if exists purchase_proofs_protect_reward_payment on public.purchase_proofs;
create trigger purchase_proofs_protect_reward_payment
  before insert or update on public.purchase_proofs
  for each row execute function public.protect_purchase_reward_payment();

create or replace function public.sync_referral_event_from_proof()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  request_row record;
  next_status text;
begin
  select referrer_id, tracking_reference, product_id
    into request_row
    from public.consultation_requests
    where id = new.consultation_request_id;

  if request_row.referrer_id is null then
    return new;
  end if;

  next_status := case
    when new.status = 'rejected' or new.reward_status = 'withheld' then 'cancelled'
    when new.reward_status = 'paid' then 'rewarded'
    when new.status = 'confirmed' or new.reward_status = 'eligible' then 'confirmed'
    else 'pending'
  end;

  update public.referral_events
  set status = next_status,
      reward_amount = coalesce(new.reward_amount, 0),
      order_reference = request_row.tracking_reference,
      product_id = request_row.product_id,
      updated_at = now()
  where consultation_request_id = new.consultation_request_id;

  return new;
end;
$$;

drop trigger if exists purchase_proofs_sync_referral_event on public.purchase_proofs;
create trigger purchase_proofs_sync_referral_event
  after insert or update on public.purchase_proofs
  for each row execute function public.sync_referral_event_from_proof();
