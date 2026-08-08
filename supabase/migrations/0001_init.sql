-- Innovatech Engineering Solutions — initial admin-managed content schema
-- Tables are readable by anyone (active rows only) and writable only by
-- authenticated users (in practice, the single admin account).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- products (Shop)
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_fr text not null,
  category text not null check (category in ('Smartphones','Wearables','Audio','Cameras','Gaming')),
  price integer not null check (price >= 0),
  old_price integer check (old_price is null or old_price >= 0),
  condition text not null default 'New' check (condition in ('New','Fairly Used')),
  badge text check (badge is null or badge in ('Best Seller','On Sale','Popular')),
  image_url text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public can view active products"
  on public.products for select
  using (active = true);

create policy "Authenticated manage products"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- wifi_packages (WiFi Zone)
-- ---------------------------------------------------------------------
create table if not exists public.wifi_packages (
  id uuid primary key default gen_random_uuid(),
  data_amount numeric not null check (data_amount > 0),
  data_unit text not null default 'GB' check (data_unit in ('MB','GB')),
  duration_days integer not null check (duration_days > 0),
  price integer not null check (price >= 0),
  old_price integer check (old_price is null or old_price >= 0),
  is_popular boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wifi_packages enable row level security;

create policy "Public can view active wifi packages"
  on public.wifi_packages for select
  using (active = true);

create policy "Authenticated manage wifi packages"
  on public.wifi_packages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- updated_at auto-touch trigger
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger wifi_packages_set_updated_at
  before update on public.wifi_packages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- storage: product images
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Authenticated update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Authenticated delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
