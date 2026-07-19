-- ============================================================================
-- seed.sql — sample content lifted from the approved design.
-- Run after 0001_init.sql (Supabase applies seed.sql automatically on `db reset`).
-- ============================================================================

-- Courses / academic streams -------------------------------------------------
insert into courses (name, level, duration, tagline, about, seats, fee, subjects, eligibility, careers, sort_order) values
('Bachelor of Arts', 'UG', '3 years', 'Humanities, languages & social sciences · 3 years',
 'A broad foundation in the humanities, letting students combine languages, history, political science and economics.',
 240, '₹12,000',
 array['English','History','Political Science','Economics','Sociology','Hindi'],
 '10+2 pass in any stream from a recognised board, with a minimum of 45% aggregate marks.',
 array['Civil Services','Journalism','Teaching','Law (via LLB)','Content & Media'], 1),

('Bachelor of Science', 'UG', '3 years', 'Physics, chemistry, maths & life sciences · 3 years',
 'A rigorous science programme with strong laboratory practice across physical and life sciences.',
 180, '₹16,000',
 array['Physics','Chemistry','Mathematics','Botany','Zoology','Computer Science'],
 '10+2 with Science (PCM/PCB) from a recognised board, minimum 50% aggregate marks.',
 array['Research','Data & Analytics','Healthcare','M.Sc / Ph.D','Lab Technology'], 2),

('Bachelor of Laws', 'UG', '3 years', 'LLB — constitutional, corporate & criminal law · 3 years',
 'A professional law degree covering constitutional, corporate, criminal and civil law with moot-court practice.',
 120, '₹22,000',
 array['Constitutional Law','Criminal Law','Contract Law','Corporate Law','Jurisprudence','Moot Court'],
 'Any graduate degree from a recognised university with a minimum of 45% aggregate marks.',
 array['Advocate','Corporate Legal','Judiciary','Legal Advisor','Public Prosecutor'], 3),

('Master of Arts', 'PG', '2 years', 'Advanced humanities & research · 2 years',
 'Advanced study and research in a chosen humanities specialisation, with a dissertation component.',
 80, '₹14,000',
 array['Advanced Theory','Research Methods','Specialisation Paper','Dissertation','Seminar'],
 'Bachelor of Arts (or equivalent) in the relevant discipline with minimum 50% marks.',
 array['Lecturer / Professor','Research','Policy & Think-tanks','Ph.D','Publishing'], 4),

('Master of Science', 'PG', '2 years', 'Specialised science & laboratory research · 2 years',
 'Specialised, research-driven science education with dedicated laboratory and project work.',
 60, '₹20,000',
 array['Advanced Specialisation','Research Methodology','Laboratory Project','Dissertation','Seminar'],
 'B.Sc in the relevant subject from a recognised university with minimum 55% marks.',
 array['Scientist / Researcher','Industry R&D','Academia','Ph.D','Quality & Analytics'], 5),

('B.Sc Agriculture', 'UG', '4 years', 'Agronomy, horticulture & agri-tech · 4 years',
 'A four-year professional programme blending agronomy, horticulture and modern agri-technology with field training.',
 100, '₹24,000',
 array['Agronomy','Soil Science','Horticulture','Plant Pathology','Agri Economics','Farm Machinery'],
 '10+2 with Science (Physics, Chemistry, Biology/Maths), minimum 50% aggregate marks.',
 array['Agri Officer','Agri-tech','Farm Management','Food Processing','Banking (Agri)'], 6);

-- Notices & events -----------------------------------------------------------
insert into notices (title, kind, body, location, published_at, is_pinned) values
('Semester examination schedule released', 'notice',
 'The datesheet for end-semester examinations is now available. Check your student portal for hall tickets.',
 null, '2026-07-18', true),
('Admissions open for the 2026–27 session', 'notice',
 'Applications for all UG and PG programmes are now open. Submit an inquiry to begin.',
 null, '2026-07-10', false),
('Library timings extended during exams', 'notice',
 'The central library will remain open until 10 PM through the examination period.',
 null, '2026-06-28', false),
('Scholarship applications invited', 'notice',
 'Merit and means-based scholarship forms are available at the accounts office until month-end.',
 null, '2026-06-20', false),
('Annual Sports Meet 2026 — registrations open', 'event',
 'Track, field and team events across departments. Register with your class coordinator.',
 'Main Ground', '2026-07-15', false),
('Guest lecture: Careers in Agri-tech', 'event',
 'An industry expert discusses emerging careers in agricultural technology.',
 'Seminar Hall B', '2026-07-02', false),
('Cultural fest — Spandan 2026', 'event',
 'Two days of music, drama and art. All students welcome.',
 'Auditorium', '2026-06-25', false);

-- Faculty --------------------------------------------------------------------
insert into faculty (name, designation, department, qualification, sort_order) values
('Dr. Anjali Verma', 'Professor & Head', 'Arts', 'Ph.D. English Literature', 1),
('Dr. Rahul Mehta', 'Associate Professor', 'Arts', 'Ph.D. History', 2),
('Dr. Sunita Rao', 'Professor', 'Science', 'Ph.D. Physics', 3),
('Dr. Vikram Singh', 'Assistant Professor', 'Science', 'Ph.D. Chemistry', 4),
('Adv. Meera Nair', 'Professor & Head', 'Law', 'LL.M., NET', 5),
('Dr. Arjun Patel', 'Associate Professor', 'Law', 'Ph.D. Constitutional Law', 6),
('Dr. Kavita Joshi', 'Professor', 'Agriculture', 'Ph.D. Agronomy', 7),
('Dr. Sanjay Kumar', 'Assistant Professor', 'Agriculture', 'Ph.D. Horticulture', 8);

-- Gallery --------------------------------------------------------------------
insert into gallery_images (title, image_url, category, sort_order) values
('Convocation 2025', '#', 'Events', 1),
('Central library', '#', 'Campus', 2),
('Science laboratory', '#', 'Academics', 3),
('Annual sports meet', '#', 'Events', 4),
('Cultural fest — Spandan', '#', 'Events', 5),
('Campus green', '#', 'Campus', 6),
('Moot court session', '#', 'Academics', 7),
('Agriculture field visit', '#', 'Academics', 8),
('Guest lecture series', '#', 'Academics', 9);

-- Downloads ------------------------------------------------------------------
insert into downloads (name, file_url, file_type, size_label, sort_order) values
('Prospectus 2026–27', '#', 'PDF', '4.2 MB', 1),
('Fee structure',      '#', 'PDF', '320 KB', 2),
('Syllabus (all courses)', '#', 'PDF', '2.1 MB', 3),
('Academic calendar',  '#', 'PDF', '180 KB', 4);
