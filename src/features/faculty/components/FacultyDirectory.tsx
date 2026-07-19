'use client';

import { useEffect, useMemo, useState } from 'react';
import { FilterPills, type FilterOption } from '@/components/ui/FilterPills';
import { departmentColor, facultyInitials } from '@/features/faculty/data';
import { highlightElement } from '@/features/search/highlight';
import type { Faculty } from '@/types/database.types';

/**
 * Seniority order for the designation filter. Known roles sort in this order;
 * any other designation an admin enters falls to the end (then alphabetical).
 */
const DESIGNATION_RANK = [
  'Principal',
  'Professor & Head',
  'Professor and Head',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
];

function rankOf(designation: string): number {
  const i = DESIGNATION_RANK.indexOf(designation.trim());
  return i === -1 ? DESIGNATION_RANK.length : i;
}

/**
 * FacultyDirectory — Faculty page grid with a designation filter.
 *
 * Filter pills are derived from the actual staff list, so they always match the
 * designations present in the database (Professor & Head, Assistant Professor,
 * …). Owns only the active-filter state; faculty data comes from the server.
 */
export function FacultyDirectory({ faculty }: { faculty: Faculty[] }) {
  const [role, setRole] = useState<string>('all');

  // Unique designations present, ordered by seniority then alphabetically.
  const filters = useMemo<FilterOption<string>[]>(() => {
    const unique = Array.from(
      new Set(faculty.map((f) => f.designation?.trim()).filter(Boolean) as string[]),
    ).sort((a, b) => rankOf(a) - rankOf(b) || a.localeCompare(b));
    return [{ value: 'all', label: 'All faculty' }, ...unique.map((d) => ({ value: d, label: d }))];
  }, [faculty]);

  const visible = useMemo(
    () => (role === 'all' ? faculty : faculty.filter((f) => f.designation === role)),
    [faculty, role],
  );

  // Deep-link support: `#faculty-<id>` from search → clear the filter, then
  // scroll to + highlight the person.
  useEffect(() => {
    function handleHash() {
      const hash = decodeURIComponent(window.location.hash).replace('#', '');
      if (!hash.startsWith('faculty-')) return;
      const id = hash.slice('faculty-'.length);
      if (!faculty.some((f) => f.id === id)) return;
      setRole('all');
      window.setTimeout(() => highlightElement(hash), 60);
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [faculty]);

  return (
    <>
      <div className="sticky top-[72px] z-30 border-b border-border bg-surface">
        <div className="container-page py-4">
          <FilterPills options={filters} active={role} onChange={setRole} />
        </div>
      </div>

      <div className="container-page py-12">
        {visible.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((person) => (
              <article
                key={person.id}
                id={`faculty-${person.id}`}
                className="overflow-hidden rounded-lg border border-border bg-surface shadow-card"
              >
                {/* Avatar banner — real photo if available, else initials on a department colour */}
                <div
                  className="flex h-[150px] items-center justify-center bg-cover bg-center"
                  style={
                    person.photo_url
                      ? { backgroundImage: `url(${person.photo_url})` }
                      : { backgroundColor: departmentColor(person.department) }
                  }
                >
                  {!person.photo_url && (
                    <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white/[0.18] font-head text-[28px] font-bold text-white">
                      {facultyInitials(person.name)}
                    </span>
                  )}
                </div>
                <div className="px-5 pb-6 pt-4">
                  <span className="inline-block rounded-full bg-section-alt px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.05em] text-navy dark:text-gold-hi">
                    {person.department}
                  </span>
                  <h3 className="mb-0.5 mt-3 font-head text-[17px] font-semibold text-text">{person.name}</h3>
                  <div className="text-sm font-medium text-gold">{person.designation}</div>
                  {person.qualification && (
                    <div className="mt-1.5 text-[13px] text-muted">{person.qualification}</div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="font-head text-lg font-semibold text-text">
              No faculty found for this filter.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
