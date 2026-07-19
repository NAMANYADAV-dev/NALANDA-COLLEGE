import { describe, it, expect } from 'vitest';
import { validateFaculty, type RawFaculty } from './schema';

const base: RawFaculty = {
  name: 'Dr. Anjali Verma',
  designation: 'Professor & Head',
  department: 'Science',
  qualification: 'Ph.D. Physics',
  email: 'anjali@college.edu.in',
  photo_url: '',
  bio: '',
  sort_order: '1',
  is_published: 'on',
};

describe('validateFaculty', () => {
  it('accepts a valid member', () => {
    expect(validateFaculty(base).ok).toBe(true);
  });

  it('requires name, designation and department', () => {
    const { ok, fieldErrors } = validateFaculty({ ...base, name: 'A', designation: '', department: '' });
    expect(ok).toBe(false);
    expect(fieldErrors?.name).toBeDefined();
    expect(fieldErrors?.designation).toBeDefined();
    expect(fieldErrors?.department).toBeDefined();
  });

  it('rejects an invalid email but allows an empty one', () => {
    expect(validateFaculty({ ...base, email: 'bad' }).fieldErrors?.email).toBeDefined();
    const { ok, values } = validateFaculty({ ...base, email: '' });
    expect(ok).toBe(true);
    expect(values.email).toBeNull();
  });

  it('normalises blank optional fields to null', () => {
    const { values } = validateFaculty({ ...base, photo_url: '', bio: '', qualification: '' });
    expect(values.photo_url).toBeNull();
    expect(values.bio).toBeNull();
    expect(values.qualification).toBeNull();
  });
});
