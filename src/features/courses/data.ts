import type { Course, CourseLevel } from '@/types/database.types';

/**
 * Static course fallback (mirrors supabase/seed.sql).
 *
 * Used by the query layer as a graceful fallback so the UI renders complete
 * content before the Supabase project is connected/seeded. Once the DB returns
 * rows, these are never used.
 */
export const COURSES_FALLBACK: Course[] = [
  {
    id: 'ba', slug: 'bachelor-of-arts', name: 'Bachelor of Arts', level: 'UG', duration: '3 years',
    tagline: 'Humanities, languages & social sciences · 3 years',
    about: 'A broad foundation in the humanities, letting students combine languages, history, political science and economics.',
    seats: 240, fee: '₹12,000',
    subjects: ['English', 'History', 'Political Science', 'Economics', 'Sociology', 'Hindi'],
    eligibility: '10+2 pass in any stream from a recognised board, with a minimum of 45% aggregate marks.',
    careers: ['Civil Services', 'Journalism', 'Teaching', 'Law (via LLB)', 'Content & Media'],
    sort_order: 1, is_published: true, created_at: '', updated_at: '',
  },
  {
    id: 'bsc', slug: 'bachelor-of-science', name: 'Bachelor of Science', level: 'UG', duration: '3 years',
    tagline: 'Physics, chemistry, maths & life sciences · 3 years',
    about: 'A rigorous science programme with strong laboratory practice across physical and life sciences.',
    seats: 180, fee: '₹16,000',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology', 'Computer Science'],
    eligibility: '10+2 with Science (PCM/PCB) from a recognised board, minimum 50% aggregate marks.',
    careers: ['Research', 'Data & Analytics', 'Healthcare', 'M.Sc / Ph.D', 'Lab Technology'],
    sort_order: 2, is_published: true, created_at: '', updated_at: '',
  },
  {
    id: 'llb', slug: 'bachelor-of-laws', name: 'Bachelor of Laws', level: 'UG', duration: '3 years',
    tagline: 'LLB — constitutional, corporate & criminal law · 3 years',
    about: 'A professional law degree covering constitutional, corporate, criminal and civil law with moot-court practice.',
    seats: 120, fee: '₹22,000',
    subjects: ['Constitutional Law', 'Criminal Law', 'Contract Law', 'Corporate Law', 'Jurisprudence', 'Moot Court'],
    eligibility: 'Any graduate degree from a recognised university with a minimum of 45% aggregate marks.',
    careers: ['Advocate', 'Corporate Legal', 'Judiciary', 'Legal Advisor', 'Public Prosecutor'],
    sort_order: 3, is_published: true, created_at: '', updated_at: '',
  },
  {
    id: 'ma', slug: 'master-of-arts', name: 'Master of Arts', level: 'PG', duration: '2 years',
    tagline: 'Advanced humanities & research · 2 years',
    about: 'Advanced study and research in a chosen humanities specialisation, with a dissertation component.',
    seats: 80, fee: '₹14,000',
    subjects: ['Advanced Theory', 'Research Methods', 'Specialisation Paper', 'Dissertation', 'Seminar'],
    eligibility: 'Bachelor of Arts (or equivalent) in the relevant discipline with minimum 50% marks.',
    careers: ['Lecturer / Professor', 'Research', 'Policy & Think-tanks', 'Ph.D', 'Publishing'],
    sort_order: 4, is_published: true, created_at: '', updated_at: '',
  },
  {
    id: 'msc', slug: 'master-of-science', name: 'Master of Science', level: 'PG', duration: '2 years',
    tagline: 'Specialised science & laboratory research · 2 years',
    about: 'Specialised, research-driven science education with dedicated laboratory and project work.',
    seats: 60, fee: '₹20,000',
    subjects: ['Advanced Specialisation', 'Research Methodology', 'Laboratory Project', 'Dissertation', 'Seminar'],
    eligibility: 'B.Sc in the relevant subject from a recognised university with minimum 55% marks.',
    careers: ['Scientist / Researcher', 'Industry R&D', 'Academia', 'Ph.D', 'Quality & Analytics'],
    sort_order: 5, is_published: true, created_at: '', updated_at: '',
  },
  {
    id: 'bsc-ag', slug: 'b-sc-agriculture', name: 'B.Sc Agriculture', level: 'UG', duration: '4 years',
    tagline: 'Agronomy, horticulture & agri-tech · 4 years',
    about: 'A four-year professional programme blending agronomy, horticulture and modern agri-technology with field training.',
    seats: 100, fee: '₹24,000',
    subjects: ['Agronomy', 'Soil Science', 'Horticulture', 'Plant Pathology', 'Agri Economics', 'Farm Machinery'],
    eligibility: '10+2 with Science (Physics, Chemistry, Biology/Maths), minimum 50% aggregate marks.',
    careers: ['Agri Officer', 'Agri-tech', 'Farm Management', 'Food Processing', 'Banking (Agri)'],
    sort_order: 6, is_published: true, created_at: '', updated_at: '',
  },
];

/** Badge tone per course level — 'gold' pill for PG, 'navy' pill for UG. */
export function levelBadgeTone(level: CourseLevel): 'navy' | 'gold' {
  return level === 'PG' ? 'gold' : 'navy';
}
