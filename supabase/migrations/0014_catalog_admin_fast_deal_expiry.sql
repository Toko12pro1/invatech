-- Shared marketplace catalog, admin metrics and automatic Fast Deal expiry.

alter table public.products
  drop constraint if exists products_category_check;

alter table public.products
  add constraint products_category_check check (category in (
    'Smartphones', 'Laptops', 'Computers', 'Tablets', 'Wearables', 'Audio',
    'Cameras', 'Gaming', 'Phone Accessories', 'Laptop Accessories',
    'Chargers', 'Earphones', 'Power Banks', 'Other Electronics'
  ));

alter table public.products
  add column if not exists fast_deal_expired_at timestamptz;

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_fr text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_categories enable row level security;

drop policy if exists "Public can view active product categories" on public.product_categories;
create policy "Public can view active product categories"
  on public.product_categories for select
  using (active = true);

drop policy if exists "Authenticated manage product categories" on public.product_categories;
create policy "Authenticated manage product categories"
  on public.product_categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists product_categories_active_sort_idx
  on public.product_categories(active, sort_order);

drop trigger if exists product_categories_set_updated_at on public.product_categories;
create trigger product_categories_set_updated_at
  before update on public.product_categories
  for each row execute function public.set_updated_at();

insert into public.product_categories (slug, name_en, name_fr, sort_order)
values
  ('smartphones', 'Smartphones', 'Smartphones', 1),
  ('laptops', 'Laptops', 'Ordinateurs portables', 2),
  ('computers', 'Computers', 'Ordinateurs', 3),
  ('tablets', 'Tablets', 'Tablettes', 4),
  ('wearables', 'Wearables', 'Objets connectés', 5),
  ('audio', 'Audio', 'Audio', 6),
  ('cameras', 'Cameras', 'Appareils photo', 7),
  ('gaming', 'Gaming', 'Gaming', 8),
  ('phone-accessories', 'Phone Accessories', 'Accessoires de téléphone', 9),
  ('laptop-accessories', 'Laptop Accessories', 'Accessoires pour ordinateur', 10),
  ('chargers', 'Chargers', 'Chargeurs', 11),
  ('earphones', 'Earphones', 'Écouteurs', 12),
  ('power-banks', 'Power Banks', 'Batteries externes', 13),
  ('other-electronics', 'Other Electronics', 'Autres appareils électroniques', 14)
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  sort_order = excluded.sort_order;

create or replace function public.deactivate_expired_fast_deals()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  changed_count integer;
begin
  update public.products
  set
    fast_deal = false,
    fast_deal_expired_at = coalesce(fast_deal_expired_at, now()),
    updated_at = now()
  where fast_deal = true
    and fast_deal_expires_at is not null
    and fast_deal_expires_at <= now();

  get diagnostics changed_count = row_count;
  return changed_count;
end;
$$;

grant execute on function public.deactivate_expired_fast_deals() to anon, authenticated;
