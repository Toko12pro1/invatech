-- Store-owner onboarding and approval workflow.
-- Applications remain pending until Innovatech reviews the business.

create table if not exists public.store_owner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  category text not null,
  location text not null,
  whatsapp text not null,
  description text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stores
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

create index if not exists store_owner_applications_status_idx
  on public.store_owner_applications(status, created_at desc);

create index if not exists stores_owner_id_idx
  on public.stores(owner_id);

alter table public.store_owner_applications enable row level security;

create policy "Store owners can create their own application"
  on public.store_owner_applications for insert
  with check (auth.uid() = user_id);

create policy "Store owners can view their own application"
  on public.store_owner_applications for select
  using (auth.uid() = user_id);

create policy "Store owners can update a pending application"
  on public.store_owner_applications for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');

create policy "Authenticated team can review store-owner applications"
  on public.store_owner_applications for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Store owners can view their own store"
  on public.stores for select
  using (auth.uid() = owner_id);

create trigger store_owner_applications_set_updated_at
  before update on public.store_owner_applications
  for each row execute function public.set_updated_at();

create or replace function public.create_store_owner_application_from_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.raw_user_meta_data ->> 'account_type' = 'store_owner' then
    insert into public.store_owner_applications (
      user_id,
      business_name,
      category,
      location,
      whatsapp,
      description
    )
    values (
      new.id,
      coalesce(nullif(btrim(new.raw_user_meta_data ->> 'business_name'), ''), 'New store'),
      coalesce(nullif(btrim(new.raw_user_meta_data ->> 'business_category'), ''), 'Other Electronics'),
      coalesce(nullif(btrim(new.raw_user_meta_data ->> 'business_location'), ''), 'Not provided'),
      coalesce(nullif(btrim(new.raw_user_meta_data ->> 'business_whatsapp'), ''), ''),
      coalesce(new.raw_user_meta_data ->> 'business_description', '')
    )
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_store_owner_application on auth.users;
create trigger on_auth_user_created_store_owner_application
  after insert on auth.users
  for each row execute procedure public.create_store_owner_application_from_signup();
