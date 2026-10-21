-- Fast Deal listings and account-backed referral identity.

alter table public.products
  add column if not exists fast_deal boolean not null default false,
  add column if not exists fast_deal_note text,
  add column if not exists fast_deal_expires_at timestamptz;

create index if not exists products_fast_deal_idx on public.products(fast_deal, active);

create table if not exists public.referral_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  referral_code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referral_events (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referral_code text not null,
  referred_name text,
  referred_phone text,
  order_reference text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rewarded', 'cancelled')),
  reward_amount integer not null default 0 check (reward_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.referral_profiles enable row level security;
alter table public.referral_events enable row level security;

create policy "Users can view their referral profile"
  on public.referral_profiles for select
  using (auth.uid() = id);

create policy "Users can update their referral profile"
  on public.referral_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can view their referral events"
  on public.referral_events for select
  using (auth.uid() = referrer_id);

create policy "Users can create their referral events"
  on public.referral_events for insert
  with check (auth.uid() = referrer_id);

create policy "Authenticated team can manage referral events"
  on public.referral_events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create or replace function public.make_referral_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate text;
begin
  loop
    candidate := 'INN-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));
    exit when not exists (select 1 from public.referral_profiles where referral_code = candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function public.handle_new_referral_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.referral_profiles (id, full_name, phone, referral_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    public.make_referral_code()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_referral_profile on auth.users;
create trigger on_auth_user_created_referral_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_referral_profile();

create trigger referral_profiles_set_updated_at
  before update on public.referral_profiles
  for each row execute function public.set_updated_at();

create trigger referral_events_set_updated_at
  before update on public.referral_events
  for each row execute function public.set_updated_at();
