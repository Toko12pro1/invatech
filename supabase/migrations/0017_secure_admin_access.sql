-- Replace broad authenticated-user access with explicit admin and owner policies.
-- Admin access is granted through auth.users.raw_app_meta_data.role = 'admin'.
-- This migration is forward-only; revoke or change roles with a later migration.

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.is_approved_store_owner()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.store_owner_applications
    where user_id = auth.uid()
      and status = 'approved'
  );
$$;

grant execute on function public.is_approved_store_owner() to anon, authenticated;

drop policy if exists "Authenticated team can review consultation requests" on public.consultation_requests;
create policy "Admins can review consultation requests"
  on public.consultation_requests for select
  using (public.is_admin());

drop policy if exists "Authenticated manage product categories" on public.product_categories;
create policy "Admins can manage product categories"
  on public.product_categories for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated team can manage traceability" on public.product_verification_checks;
create policy "Admins can manage traceability"
  on public.product_verification_checks for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated manage products" on public.products;
create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Approved store owners manage own products"
  on public.products for all
  using (
    public.is_approved_store_owner()
    and exists (
      select 1
      from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    public.is_approved_store_owner()
    and exists (
      select 1
      from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  );

drop policy if exists "Authenticated team can review purchase proofs" on public.purchase_proofs;
create policy "Admins can review purchase proofs"
  on public.purchase_proofs for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated team can manage referral events" on public.referral_events;
create policy "Admins can manage referral events"
  on public.referral_events for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated team can review referral profiles" on public.referral_profiles;
create policy "Admins can review referral profiles"
  on public.referral_profiles for select
  using (public.is_admin());

drop policy if exists "Authenticated team can review store-owner applications" on public.store_owner_applications;
create policy "Admins can review store-owner applications"
  on public.store_owner_applications for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated manage stores" on public.stores;
create policy "Admins can manage stores"
  on public.stores for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated manage wifi packages" on public.wifi_packages;
create policy "Admins can manage wifi packages"
  on public.wifi_packages for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated manage vouchers" on public.wifi_vouchers;
create policy "Admins can manage vouchers"
  on public.wifi_vouchers for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated upload product images" on storage.objects;
drop policy if exists "Authenticated update product images" on storage.objects;
drop policy if exists "Authenticated delete product images" on storage.objects;
create policy "Admins can manage product images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Approved store owners upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and name like 'seller-products/' || auth.uid()::text || '/%'
    and public.is_approved_store_owner()
  );

create policy "Approved store owners update product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and name like 'seller-products/' || auth.uid()::text || '/%'
    and public.is_approved_store_owner()
  )
  with check (
    bucket_id = 'product-images'
    and name like 'seller-products/' || auth.uid()::text || '/%'
    and public.is_approved_store_owner()
  );

create policy "Approved store owners delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and name like 'seller-products/' || auth.uid()::text || '/%'
    and public.is_approved_store_owner()
  );

drop policy if exists "Authenticated team can view purchase proof photos" on storage.objects;
drop policy if exists "Authenticated team can update purchase proof photos" on storage.objects;
drop policy if exists "Authenticated team can delete purchase proof photos" on storage.objects;
create policy "Admins can view purchase proof photos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'purchase-proofs' and public.is_admin());

create policy "Admins can update purchase proof photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'purchase-proofs' and public.is_admin())
  with check (bucket_id = 'purchase-proofs' and public.is_admin());

create policy "Admins can delete purchase proof photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'purchase-proofs' and public.is_admin());
