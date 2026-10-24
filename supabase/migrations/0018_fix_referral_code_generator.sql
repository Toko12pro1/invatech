-- Fix referral code generation when SECURITY DEFINER functions use a restricted search_path.
-- Supabase installs pgcrypto functions in the extensions schema.

create or replace function public.make_referral_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate text;
begin
  loop
    candidate := 'INN-' || upper(substr(encode(extensions.gen_random_bytes(4), 'hex'), 1, 6));
    exit when not exists (select 1 from public.referral_profiles where referral_code = candidate);
  end loop;
  return candidate;
end;
$$;
