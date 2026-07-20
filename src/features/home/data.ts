import type { IconName } from '@/components/ui/Icon';

/**
 * Home-page marketing content that is NOT managed via the admin portal
 * (portal shortcuts, headline stats, trust points, testimonials, FAQs).
 * Kept as typed constants so it is easy to read, review and later migrate to
 * the database if it ever needs editing by non-developers.
 */

/**
 * Student-portal shortcut cards. `icon` is a raw SVG path (see SvgGlyph). `key`
 * ties each card to its admin-editable URL setting (`portal_<key>`); the `href`
 * here is only the fallback used before an admin sets the real link.
 */
export interface PortalItem {
  key: string;
  label: string;
  desc: string;
  icon: string;
  href: string;
}

export const PORTAL_ITEMS: PortalItem[] = [
  { key: 'admit_card', label: 'Admit Card', desc: 'Download your exam hall ticket', href: '#', icon: 'M4 4h16v16H4zM4 9h16M8 14h8M8 17h5' },
  { key: 'exam_scheme', label: 'Exam Scheme', desc: 'Semester exam scheme & pattern', href: '#', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { key: 'results', label: 'Results', desc: 'Check semester results & marks', href: '#', icon: 'M3 3v18h18M7 15l4-4 3 3 5-6' },
  { key: 'time_table', label: 'Time Table', desc: 'Class & examination timetable', href: '#', icon: 'M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z' },
  { key: 'syllabus', label: 'Syllabus', desc: 'Course-wise official syllabus', href: '#', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
  { key: 'revaluation', label: 'Revaluation', desc: 'Apply for rechecking of answers', href: '#', icon: 'M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16' },
];

/** Hero stats card figures. */
export const HERO_STATS = [
  { value: '60+', label: 'Years of legacy' },
  { value: '30+', label: 'Programmes' },
  { value: '8,000+', label: 'Students enrolled' },
  { value: '150+', label: 'Faculty members' },
];

/** "Why choose Nalanda" trust points. */
export interface TrustItem {
  icon: IconName;
  title: string;
  desc: string;
}

export const TRUST_ITEMS: TrustItem[] = [
  { icon: 'cap', title: 'NAAC Accredited', desc: 'Quality assured by the national accreditation council.' },
  { icon: 'award', title: '60+ Years of Legacy', desc: 'Six decades of trusted higher education.' },
  { icon: 'users', title: 'Experienced Faculty', desc: 'Credentialed teachers mentoring every student.' },
  { icon: 'trending', title: 'Placement Support', desc: 'Dedicated cell for careers and higher studies.' },
];

/** Placement highlight figures. */
export const PLACEMENT_STATS = [
  { value: '85%', label: 'Students placed / higher studies' },
  { value: '120+', label: 'Recruiting organisations' },
  { value: '₹6.2L', label: 'Highest package (2025)' },
];

/** Student testimonials. `avatarBg` colours the initials chip. */
export interface Testimonial {
  quote: string;
  name: string;
  meta: string;
  initials: string;
  avatarBg: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { quote: 'The faculty genuinely care. The mentorship I got here shaped both my degree and my career direction.', name: 'Priya R.', meta: 'B.Sc, Class of 2024', initials: 'PR', avatarBg: '#1B3A6B' },
  { quote: 'From moot courts to internships, Nalanda gave me real-world exposure that made all the difference.', name: 'Arjun K.', meta: 'LLB, Class of 2023', initials: 'AK', avatarBg: '#1b6e3d' },
  { quote: "Affordable, welcoming and academically strong — I'd choose this campus all over again.", name: 'Sneha N.', meta: 'M.A, Class of 2025', initials: 'SN', avatarBg: '#8f6519' },
];

/** Frequently asked questions (accordion). */
export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  { q: 'What is the admission process?', a: 'Apply online through the Admissions page, upload your documents, appear for the entrance test (if applicable), and confirm your seat after the merit list is published.' },
  { q: 'What documents do I need to apply?', a: '10+2 marksheet and certificate, transfer certificate, ID proof, passport-size photographs, and category certificate if applicable.' },
  { q: 'Are scholarships available?', a: 'Yes — merit scholarships, government post-matric scholarships, and need-based fee concessions are available. Details are shared during counselling.' },
  { q: 'Is hostel accommodation provided?', a: 'Separate hostels for boys and girls are available on a first-come, first-served basis, with mess and Wi-Fi facilities.' },
  { q: 'Can I visit the campus before applying?', a: 'Absolutely. Campus visits run Monday to Saturday, 10am–4pm. Use the Contact page to schedule a visit with our admissions team.' },
];
