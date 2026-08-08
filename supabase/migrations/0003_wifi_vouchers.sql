-- Persisted, single-use WiFi Zone vouchers. A code is reserved the moment it's
-- generated (unique constraint), so it can never be issued to a second person.

create table if not exists public.wifi_vouchers (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.wifi_packages(id) on delete restrict,
  code text not null unique,
  status text not null default 'pending' check (status in ('pending','paid','used')),
  buyer_contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wifi_vouchers enable row level security;

-- Anyone can reserve a new voucher (the public generator), but only ever as
-- a fresh 'pending' row — they cannot create one already marked paid/used,
-- and cannot read, list, or modify existing vouchers (no select/update policy
-- for anon), so a code can't be looked up or reused by a different visitor.
create policy "Public can create a pending voucher"
  on public.wifi_vouchers for insert
  to anon
  with check (status = 'pending');

create policy "Authenticated manage vouchers"
  on public.wifi_vouchers for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create trigger wifi_vouchers_set_updated_at
  before update on public.wifi_vouchers
  for each row execute function public.set_updated_at();
