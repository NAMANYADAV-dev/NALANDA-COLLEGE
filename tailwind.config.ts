import type { Config } from 'tailwindcss';

/**
 * Tailwind theme.
 *
 * The brand palette lives as CSS custom properties in `globals.css` (so we can
 * flip them for dark mode in one place). Here we simply expose those variables
 * as semantic Tailwind color tokens — e.g. `bg-surface`, `text-navy`,
 * `border-border` — which keeps components readable and theme-agnostic.
 *
 * Dark mode is class/attribute driven: we toggle `data-theme="dark"` on <html>,
 * and the CSS variables update, so every utility that references a token adapts
 * automatically without `dark:` variants scattered across the code.
 */
const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        'navy-deep': 'var(--color-navy-deep)',
        'navy-darkest': 'var(--color-navy-darkest)',
        gold: 'var(--color-gold)',
        'gold-hi': 'var(--color-gold-hi)',
        'gold-hover': 'var(--color-gold-hover)',

        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        heading: 'var(--color-heading)',

        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'section-alt': 'var(--color-section-alt)',
        band: 'var(--color-band)',
        border: 'var(--color-border)',
        'chip-bg': 'var(--color-chip-bg)',
        'faint-gold': 'var(--color-faint-gold)',
      },
      fontFamily: {
        // Bound to the next/font CSS variables set in the root layout.
        head: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        card: 'var(--shadow-sm)',
        'card-hover': 'var(--shadow-md)',
        nav: 'var(--shadow-nav)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in .18s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
