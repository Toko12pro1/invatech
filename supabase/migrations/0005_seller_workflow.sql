-- Seller-friendly listing fields.
-- New submissions can stay pending until Innovatech checks the product.

alter table public.products
  add column if not exists negotiable boolean not null default false,
  add column if not exists listing_status text not null default 'approved'
    check (listing_status in ('draft', 'pending', 'approved', 'rejected'));

create index if not exists products_listing_status_idx on public.products(listing_status);

update public.products
set listing_status = 'approved'
where listing_status is null;
