'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

const STORAGE_KEY = 'nalanda-theme';

/**
 * ThemeToggle — flips light/dark by setting `data-theme` on <html>.
 *
 * The initial theme is applied before paint by an inline script in the root
 * layout (see ThemeScript) to avoid a flash. This component only reflects and
 * updates that state, persisting the choice to localStorage.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Sync React state with whatever the no-flash script already set on <html>.
  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      /* localStorage may be unavailable (private mode) — non-critical. */
    }
  }

  return (
    <button
      onClick={toggle}
      title="Toggle dark mode"
      aria-label="Toggle dark mode"
      className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-border bg-surface text-navy hover:bg-section-alt dark:text-gold-hi"
    >
      <Icon name={dark ? 'sun' : 'moon'} size={18} />
    </button>
  );
}

/**
 * ThemeScript — runs synchronously in <head> before first paint to set the
 * saved (or system-preferred) theme, preventing a light/dark flash on load.
 * Rendered once in the root layout.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
