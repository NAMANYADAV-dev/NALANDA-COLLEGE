/**
 * Public page transition wrapper.
 *
 * A `template` (unlike a `layout`) remounts on every navigation, so the
 * fade-in animation replays each time — pages ease in instead of snapping in.
 * Purely presentational; adds no client JavaScript.
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
