-- ============================================================================
-- enquiry_cooldown.sql — rate-limit enquiries to one per email per 30 minutes
-- ============================================================================
-- The public (anon) role can INSERT enquiries but (by design) can't SELECT them,
-- so the app itself can't check for a recent submission. This SECURITY DEFINER
-- function runs with elevated rights to do the check + insert together:
--   * If the same email submitted within the cooldown window → return the time
--     they can try again (no insert).
--   * Otherwise → insert the enquiry and return ok.
--
-- To change the window, edit the `cooldown` interval below. Run once in
-- Supabase → SQL Editor. Safe to re-run (create or replace).
-- ============================================================================

create or replace function public.submit_enquiry(
  p_name    text,
  p_email   text,
  p_phone   text,
  p_subject text,
  p_message text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  cooldown constant interval := interval '30 minutes';
  last_at  timestamptz;
begin
  -- Most recent enquiry from this email still inside the cooldown window.
  select created_at into last_at
  from enquiries
  where lower(email) = lower(btrim(p_email))
    and created_at > now() - cooldown
  order by created_at desc
  limit 1;

  if last_at is not null then
    -- Blocked: compute the remaining minutes IN THE DB (one clock — no app/DB
    -- timezone or skew issues) and tell the caller how long to wait.
    return jsonb_build_object(
      'ok', false,
      'wait_minutes', greatest(1, ceil(extract(epoch from ((last_at + cooldown) - now())) / 60.0))
    );
  end if;

  insert into enquiries (name, email, phone, subject, message)
  values (btrim(p_name), btrim(p_email), p_phone, p_subject, p_message);

  return jsonb_build_object('ok', true, 'wait_minutes', 0);
end;
$$;

-- Public form (anon) + admins may call it; the function's own rights do the write.
grant execute on function public.submit_enquiry(text, text, text, text, text)
  to anon, authenticated;
