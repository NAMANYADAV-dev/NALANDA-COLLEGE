-- ============================================================================
-- 0004_login_throttle.sql — slow down brute-force admin logins
-- ============================================================================
-- Defense in depth on top of Supabase Auth's own rate limiting. Counts failed
-- sign-in attempts per client IP and, after too many in a short window, makes
-- the login form refuse for a cooldown period.
--
-- Keyed on IP, NOT email, on purpose: email-keyed throttling lets an attacker
-- lock a real admin out just by spamming failures for their address. Throttling
-- the source instead only slows the attacker down.
--
-- The three functions are SECURITY DEFINER and run as the table owner, so the
-- anon role (login happens before auth) can call them without any direct table
-- access. The signIn server action calls them and FAILS OPEN — if this
-- migration hasn't run yet, login simply proceeds unthrottled.
--
-- Config: 8 failures within 15 minutes → cooldown until they age out.
-- Run once in Supabase → SQL Editor. Safe to re-run.
-- ============================================================================

create table if not exists public.login_attempts (
  id           bigint generated always as identity primary key,
  ip           text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists login_attempts_ip_time
  on public.login_attempts (ip, attempted_at desc);

-- RLS on, no policies: the anon/authenticated roles get NO direct access.
-- Only the SECURITY DEFINER functions below (which bypass RLS) touch it.
alter table public.login_attempts enable row level security;

-- Minutes of cooldown remaining for this IP, or 0 if the caller may proceed.
create or replace function public.login_cooldown_remaining(p_ip text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window    constant interval := interval '15 minutes';
  v_threshold constant integer  := 8;
  v_count     integer;
  v_oldest    timestamptz;
begin
  select count(*), min(attempted_at)
    into v_count, v_oldest
  from public.login_attempts
  where ip = p_ip
    and attempted_at > now() - v_window;

  if v_count >= v_threshold then
    return greatest(0, ceil(extract(epoch from (v_oldest + v_window - now())) / 60))::integer;
  end if;
  return 0;
end;
$$;

-- Record one failed attempt (and opportunistically prune old rows).
create or replace function public.record_login_failure(p_ip text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.login_attempts (ip) values (p_ip);
  delete from public.login_attempts where attempted_at < now() - interval '1 day';
end;
$$;

-- Wipe an IP's failures after a successful login.
create or replace function public.clear_login_failures(p_ip text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.login_attempts where ip = p_ip;
end;
$$;

grant execute on function public.login_cooldown_remaining(text) to anon, authenticated;
grant execute on function public.record_login_failure(text)     to anon, authenticated;
grant execute on function public.clear_login_failures(text)     to anon, authenticated;
