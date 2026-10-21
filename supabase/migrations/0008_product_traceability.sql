-- A transparent, non-sensitive history for product and seller checks.
-- Never store the full IMEI, ID card number, or private customer information here.

alter table public.products
  add column if not exists verification_level text not null default 'seller_listed'
    check (verification_level in ('seller_listed', 'store_reviewed', 'innovatech_checked', 'innovatech_stock')),
  add column if not exists verification_scope text[] not null default '{}',
  add column if not exists verified_by text,
  add column if not exists verification_reference text,
  add column if not exists last_checked_at timestamptz;

create unique index if not exists products_verification_reference_idx
  on public.products(verification_reference)
  where verification_reference is not null;

create table if not exists public.product_verification_checks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  check_type text not null check (check_type in ('listing_review', 'physical_check', 'availability_check', 'price_update', 'seller_follow_up')),
  result text not null check (result in ('passed', 'needs_attention')),
  summary text not null,
  scope text[] not null default '{}',
  checked_by text not null,
  reference_code text not null unique,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists product_verification_checks_product_idx
  on public.product_verification_checks(product_id, checked_at desc);

alter table public.product_verification_checks enable row level security;

drop policy if exists "Public can view traceability for active products" on public.product_verification_checks;
create policy "Public can view traceability for active products"
  on public.product_verification_checks for select
  using (
    exists (
      select 1
      from public.products
      where products.id = product_verification_checks.product_id
        and products.active = true
        and products.listing_status = 'approved'
    )
  );

drop policy if exists "Authenticated team can manage traceability" on public.product_verification_checks;
create policy "Authenticated team can manage traceability"
  on public.product_verification_checks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Existing active listings were already reviewed as part of the marketplace seed.
-- Mark them as store-reviewed, not physically tested, until a team member records that check.
update public.products
set
  verification_level = case when verification_status = 'verified' then 'store_reviewed' else 'seller_listed' end,
  verification_scope = case
    when verification_status = 'verified' then array['Seller connection', 'Listing details']::text[]
    else '{}'::text[]
  end,
  verified_by = case when verification_status = 'verified' then 'Innovatech marketplace team' else null end,
  verification_reference = case
    when verification_status = 'verified' then 'INN-CHK-' || upper(substr(md5(id::text), 1, 8))
    else null
  end,
  last_checked_at = case when verification_status = 'verified' then coalesce(verified_at, updated_at, now()) else null end
where verification_reference is null;
