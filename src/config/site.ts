/**
 * Site-wide static configuration.
 *
 * Central, typed source of truth for brand identity, navigation and contact
 * details. Layout, nav, footer and page metadata all read from here so there
 * is exactly one place to edit when these change.
 */

export interface NavLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: 'Nalanda College',
  shortName: 'Nalanda',
  tagline: 'Affiliated to State University',
  description:
    'A co-educational institution affiliated to the State University, offering UG & PG programmes across arts, science, law and agriculture since 1962.',
  established: 1962,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  contact: {
    address: 'Milkipur, Ayodhya, Uttar Pradesh',
    phone: '+91 98780 91649',
    email: 'info@nalandacollege.edu.in',
  },

  social: [
    { label: 'Facebook', href: '#', icon: 'facebook' },
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'Twitter', href: '#', icon: 'twitter' },
  ],

  /**
   * Brand imagery served from /public/images. Just drop the files in with these
   * exact names and they appear automatically (see public/images/README.md).
   * Each usage falls back gracefully until the file exists.
   */
  images: {
    hero: '/images/hero.jpg', // Home hero background
    universityLogo: '/images/university-logo.png', // About → affiliation banner
    principal: '/images/principal.jpg', // About → principal's message
    ogImage: '/images/og-image.jpg', // Social share / link preview
  },

  /** Head of institution — shown in the About page principal's message. */
  principal: {
    name: 'Dr. Anand Mohan Sharma',
    title: 'Principal, Nalanda College',
  },
} as const;

/** Primary links shown inline in the desktop navbar. */
export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Admissions', href: '/admissions' },
];

/** Secondary links tucked under the "Explore" dropdown. */
export const exploreNav: NavLink[] = [
  { label: 'Faculty', href: '/faculty' },
  { label: 'Notices & Events', href: '/notices' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Downloads', href: '/downloads' },
  { label: 'Contact', href: '/contact' },
];

/** Footer "Quick links" column. */
export const footerNav: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Faculty', href: '/faculty' },
];

/** Key admission dates surfaced in the hero dates bar (edit each cycle). */
export const admissionDates = {
  applicationsClose: '31 Aug 2026',
  entranceTest: '14 Sep 2026',
  sessionBegins: '01 Oct 2026',
} as const;
