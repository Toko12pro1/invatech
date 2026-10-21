-- Marketplace partner network and verification metadata.
-- Store owners are reviewed by Innovatech before they are made visible.

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  location text not null,
  whatsapp text not null,
  description text not null default '',
  image_url text,
  response_time text,
  verified boolean not null default false,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists store_id uuid references public.stores(id) on delete set null,
  add column if not exists verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified', 'rejected')),
  add column if not exists verification_note text,
  add column if not exists verified_at timestamptz;

alter table public.stores enable row level security;

create policy "Public can view active verified stores"
  on public.stores for select
  using (active = true and verified = true);

create policy "Authenticated manage stores"
  on public.stores for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists products_store_id_idx on public.products(store_id);
create index if not exists stores_active_verified_idx on public.stores(active, verified);

create trigger stores_set_updated_at
  before update on public.stores
  for each row execute function public.set_updated_at();

-- These are starter records for local development. Replace the WhatsApp
-- numbers and mark stores active only after the partner has been reviewed.
insert into public.stores (name, category, location, whatsapp, description, image_url, response_time, verified, active)
values
  ('MobiTech Centre', 'Phones & accessories', 'Melen, Yaoundé', '237651162373', 'Smartphones, chargers and reliable everyday accessories for work and school.', '/images/product-phone.jpg', 'Usually replies in 10 min', true, true),
  ('Nexa Gadgets', 'Audio & wearables', 'Bastos, Yaoundé', '237651162373', 'Curated audio, smartwatches and connected gadgets, checked before listing.', '/images/product-smartwatch.jpg', 'Usually replies in 20 min', true, true),
  ('CamPoint Studio', 'Cameras & creative gear', 'Akwa, Douala', '237651162373', 'Cameras and creator gear for people who want to make, document and share.', '/images/product-camera.jpg', 'Usually replies in 15 min', true, true)
on conflict do nothing;

update public.products
set
  store_id = case
    when category = 'Smartphones' then (select id from public.stores where name = 'MobiTech Centre' limit 1)
    when category in ('Wearables', 'Audio') then (select id from public.stores where name = 'Nexa Gadgets' limit 1)
    when category = 'Cameras' then (select id from public.stores where name = 'CamPoint Studio' limit 1)
    else store_id
  end,
  verification_status = 'verified',
  verified_at = coalesce(verified_at, now())
where active = true;
