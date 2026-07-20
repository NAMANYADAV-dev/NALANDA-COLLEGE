'use client';

import { useEffect } from 'react';

/**
 * Last-resort error boundary.
 *
 * Only fires when the ROOT layout itself throws — at that point the layout that
 * normally provides <html>/<body> never rendered, so this component must supply
 * them. For the same reason the styling is inline: `globals.css` is imported by
 * the root layout, and we cannot assume it loaded.
 *
 * If a visitor ever sees this screen something is badly wrong (bad env vars, a
 * broken deploy), so it stays deliberately plain and dependency-free — this
 * file must not be able to fail.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[root] fatal error:', error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#eef2f7',
          color: '#222a35',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '440px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#1b3a6b' }}>
            Nalanda College
          </h1>
          <p style={{ marginTop: '16px', fontSize: '16px', lineHeight: 1.6 }}>
            The site is temporarily unavailable. Please try again in a few minutes.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              border: 0,
              borderRadius: '8px',
              background: '#8f6519',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: '28px', fontSize: '12px', color: '#5a6472' }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
