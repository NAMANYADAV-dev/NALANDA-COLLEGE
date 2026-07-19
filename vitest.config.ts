import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Vitest config for the unit tests. Pure-function tests only (validators, small
 * utils) — Node environment, no DOM/DB needed. The `@` alias mirrors the app's
 * tsconfig path so tests import modules exactly as the app does.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
