-- Free negotiation is available only for customers who confirm they are ready to buy.
-- Referral codes are captured with the request and rewarded only after a confirmed sale.

alter table public.consultation_requests
  add column if not exists ready_to_buy boolean not null default false,
  add column if not exists referral_code text;

create index if not exists consultation_requests_referral_code_idx
  on public.consultation_requests(referral_code)
  where referral_code is not null;
