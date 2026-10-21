-- Keep the legal document version accepted for service requests.
-- This is an audit marker, not a replacement for the full legal document.

alter table public.consultation_requests
  add column if not exists terms_version text,
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists privacy_accepted_at timestamptz;
