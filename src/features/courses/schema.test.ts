import { describe, it, expect } from 'vitest';
import { validateCourse, parseList, type RawCourse } from './schema';

const base: RawCourse = {
  name: 'Bachelor of Science',
  level: 'UG',
  duration: '3 years',
  tagline: 'Explore the sciences',
  about: 'A broad undergraduate science programme.',
  seats: '60',
  fee: '₹16,000',
  subjects: 'Physics\nChemistry\nMathematics',
  eligibility: '10+2 with Science',
  careers: 'Research, Analytics',
  sort_order: '1',
  is_published: 'on',
};

describe('parseList', () => {
  it('splits on newlines and commas, trimming and dropping blanks', () => {
    expect(parseList('Physics\nChemistry, Maths')).toEqual(['Physics', 'Chemistry', 'Maths']);
    expect(parseList('  a ,, b \n')).toEqual(['a', 'b']);
    expect(parseList('')).toEqual([]);
  });
});

describe('validateCourse', () => {
  it('accepts a complete course and parses numbers + lists', () => {
    const { ok, values, fieldErrors } = validateCourse(base);
    expect(ok).toBe(true);
    expect(fieldErrors).toEqual({});
    expect(values.seats).toBe(60);
    expect(values.sort_order).toBe(1);
    expect(values.subjects).toEqual(['Physics', 'Chemistry', 'Mathematics']);
    expect(values.careers).toEqual(['Research', 'Analytics']);
    expect(values.is_published).toBe(true);
  });

  it('coerces the level to UG unless it is exactly PG', () => {
    expect(validateCourse({ ...base, level: 'PG' }).values.level).toBe('PG');
    expect(validateCourse({ ...base, level: 'nonsense' }).values.level).toBe('UG');
  });

  it('flags required fields when missing', () => {
    const { ok, fieldErrors } = validateCourse({ ...base, name: 'A', duration: '', fee: '' });
    expect(ok).toBe(false);
    expect(fieldErrors?.name).toBeDefined();
    expect(fieldErrors?.duration).toBeDefined();
    expect(fieldErrors?.fee).toBeDefined();
  });

  it('defaults unparseable seats to 0 and is_published false when unchecked', () => {
    const { values } = validateCourse({ ...base, seats: 'abc', is_published: null });
    expect(values.seats).toBe(0);
    expect(values.is_published).toBe(false);
  });
});
