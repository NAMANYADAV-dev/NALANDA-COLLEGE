import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

/**
 * Flat ESLint config (ESLint 9).
 *
 * Bridges Next's shareable configs — which are still eslintrc-style — into flat
 * config via FlatCompat, the same shape create-next-app generates. `next lint`
 * is deprecated, so CI and local runs use the ESLint CLI directly (`npm run
 * lint`). Build artefacts and test output are ignored so lint only sees source.
 */
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default config;
