-- Rewards are campaign-based: the default starts at 1,000 FCFA but may be higher.

alter table public.purchase_proofs
  add column if not exists reward_amount integer check (reward_amount is null or reward_amount >= 0);
