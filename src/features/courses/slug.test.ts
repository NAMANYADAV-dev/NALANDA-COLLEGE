import { describe, it, expect } from 'vitest';
import { slugify, isValidSlug } from './slug';

describe('slugify', () => {
  it('lowercases and hyphenates a normal name', () => {
    expect(slugify('Bachelor of Arts')).toBe('bachelor-of-arts');
  });

  it('collapses punctuation into single hyphens', () => {
    // The exact case that matters: this is how the live course names are written.
    expect(slugify('Bachelor of Science (B.Sc.)')).toBe('bachelor-of-science-b-sc');
    expect(slugify('B.Sc  Agriculture')).toBe('b-sc-agriculture');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  —Master of Arts—  ')).toBe('master-of-arts');
  });

  it('folds accents to ASCII instead of dropping the letter', () => {
    expect(slugify('Māori Studies')).toBe('maori-studies');
  });

  it('returns an empty string for names with nothing slug-able', () => {
    // Callers must fall back (the DB uses the row id) rather than store "".
    expect(slugify('!!! ???')).toBe('');
  });

  it('never ends on a hyphen after truncation', () => {
    const slug = slugify('a'.repeat(58) + ' bcdefgh');
    expect(slug.endsWith('-')).toBe(false);
    expect(slug.length).toBeLessThanOrEqual(60);
  });

  it('is idempotent — slugifying a slug changes nothing', () => {
    const once = slugify('Bachelor of Science (B.Sc.)');
    expect(slugify(once)).toBe(once);
  });
});

describe('isValidSlug', () => {
  it('accepts what slugify produces', () => {
    for (const name of ['Bachelor of Arts', 'B.Sc Agriculture', 'Master of Science']) {
      expect(isValidSlug(slugify(name))).toBe(true);
    }
  });

  it('rejects slugs a hand-editing admin might type', () => {
    for (const bad of ['', '-leading', 'trailing-', 'double--hyphen', 'Upper', 'has space', 'slash/es']) {
      expect(isValidSlug(bad)).toBe(false);
    }
  });
});
