import { describe, it, expect } from 'vitest';
import { parseStorageRef, isManagedStorageUrl } from './public-url';
import { formatBytes } from '@/config/storage';

const PUBLIC = 'https://ref.supabase.co/storage/v1/object/public';

describe('parseStorageRef', () => {
  it('parses a managed-bucket public URL into { bucket, path }', () => {
    expect(parseStorageRef(`${PUBLIC}/gallery/1721-abc.webp`)).toEqual({
      bucket: 'gallery',
      path: '1721-abc.webp',
    });
    expect(parseStorageRef(`${PUBLIC}/downloads/prospectus.pdf`)).toEqual({
      bucket: 'downloads',
      path: 'prospectus.pdf',
    });
  });

  it('strips a query string from the path', () => {
    expect(parseStorageRef(`${PUBLIC}/faculty/p.webp?token=xyz`)?.path).toBe('p.webp');
  });

  it('returns null for placeholder, empty, external and unmanaged URLs', () => {
    expect(parseStorageRef('#')).toBeNull();
    expect(parseStorageRef('')).toBeNull();
    expect(parseStorageRef(null)).toBeNull();
    expect(parseStorageRef('https://example.com/photo.jpg')).toBeNull();
    expect(parseStorageRef(`${PUBLIC}/other-bucket/x.png`)).toBeNull();
  });
});

describe('isManagedStorageUrl', () => {
  it('is true only for our managed buckets', () => {
    expect(isManagedStorageUrl(`${PUBLIC}/gallery/x.webp`)).toBe(true);
    expect(isManagedStorageUrl('#')).toBe(false);
    expect(isManagedStorageUrl('https://cdn.example.com/x.png')).toBe(false);
  });
});

describe('formatBytes', () => {
  it('formats bytes as MB / KB / B', () => {
    expect(formatBytes(10 * 1024 * 1024)).toBe('10 MB');
    expect(formatBytes(320 * 1024)).toBe('320 KB');
    expect(formatBytes(500)).toBe('500 B');
  });
});
