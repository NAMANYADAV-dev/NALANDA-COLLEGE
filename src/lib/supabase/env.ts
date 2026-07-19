/**
 * isSupabaseConfigured — true when the Supabase env keys are present.
 *
 * The public data queries use this to decide whether to serve seed/fallback
 * samples. The rule: samples appear ONLY when Supabase isn't configured (so the
 * site isn't blank during setup). Once configured, queries return the database
 * exactly as-is — an empty table renders an empty state, never the samples — so
 * the public site always mirrors what's really in the database.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
