-- Requests for transparent product checks, negotiations and repair analysis.

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  request_type text not null check (request_type in ('product_check', 'negotiate_purchase', 'repair_analysis', 'business_advice')),
  customer_name text not null,
  phone text not null,
  product_name text,
  product_link text,
  seller_name text,
  city text,
  notes text,
  fee_acknowledged boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'quoted', 'in_progress', 'completed', 'cancelled')),
  agreed_fee integer check (agreed_fee is null or agreed_fee >= 0),
  result_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists consultation_requests_user_idx on public.consultation_requests(user_id, created_at desc);
create index if not exists consultation_requests_status_idx on public.consultation_requests(status, created_at desc);

alter table public.consultation_requests enable row level security;

create policy "Anyone can submit a consultation request"
  on public.consultation_requests for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Users can view their consultation requests"
  on public.consultation_requests for select
  using (auth.uid() = user_id);

create trigger consultation_requests_set_updated_at
  before update on public.consultation_requests
  for each row execute function public.set_updated_at();
