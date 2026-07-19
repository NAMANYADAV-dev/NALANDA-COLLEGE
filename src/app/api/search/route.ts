import { NextResponse } from 'next/server';
import { buildSearchIndex } from '@/features/search';

/**
 * GET /api/search — returns the full search index as JSON.
 *
 * The client fetches this once when search first opens and caches it in memory,
 * so repeat opens never re-hit this route. It reads the session cookie via the
 * query layer, so it runs dynamically per request.
 */
export async function GET() {
  const items = await buildSearchIndex();
  return NextResponse.json({ items });
}
