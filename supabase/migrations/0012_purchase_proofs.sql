-- Track direct purchases and keep private receipt or Mobile Money evidence.
-- Innovatech remains the connector unless the written invoice names it as seller.

alter table public.consultation_requests
  drop constraint if exists consultation_requests_request_type_check;

alter table public.consultation_requests
  add constraint consultation_requests_request_type_check
  check (request_type in ('product_check', 'negotiate_purchase', 'purchase_trace', 'repair_analysis', 'business_advice'));

alter table public.consultation_requests
  add column if not exists tracking_reference text;

create unique index if not exists consultation_requests_tracking_reference_idx
  on public.consultation_requests(tracking_reference)
  where tracking_reference is not null;

create table if not exists public.purchase_proofs (
  id uuid primary key default gen_random_uuid(),
  consultation_request_id uuid not null references public.consultation_requests(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  proof_type text not null check (proof_type in ('store_receipt', 'mobile_money')),
  storage_path text not null,
  original_filename text,
  mime_type text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected', 'disputed')),
  reward_status text not null default 'pending' check (reward_status in ('pending', 'eligible', 'paid', 'withheld')),
  reviewer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchase_proofs_request_idx
  on public.purchase_proofs(consultation_request_id, created_at desc);

alter table public.purchase_proofs enable row level security;

create policy "Customers can submit purchase proofs"
  on public.purchase_proofs for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Customers can view their purchase proofs"
  on public.purchase_proofs for select
  using (auth.uid() = user_id);

create policy "Authenticated team can review purchase proofs"
  on public.purchase_proofs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create trigger purchase_proofs_set_updated_at
  before update on public.purchase_proofs
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'purchase-proofs',
  'purchase-proofs',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']::text[]
)
on conflict (id) do update set public = false;

create policy "Customers can upload purchase proof photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'purchase-proofs' and name like 'proofs/%');

create policy "Authenticated team can view purchase proof photos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'purchase-proofs');

create policy "Authenticated team can update purchase proof photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'purchase-proofs')
  with check (bucket_id = 'purchase-proofs');

create policy "Authenticated team can delete purchase proof photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'purchase-proofs');
