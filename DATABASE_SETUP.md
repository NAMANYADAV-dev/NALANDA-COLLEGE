# Nalanda College — Supabase Database Setup Report

Ye file batati hai ki Supabase me **kaun-kaun se tables** banane hain aur **har table me kya information (columns)** aayegi. Poora schema `supabase/migrations/0001_init.sql` se match karta hai — website ka code isi structure ke hisaab se likha gaya hai, isliye column names/types **bilkul same** rakhna zaroori hai.

---

## ⚡ Sabse tez tarika (Recommended) — bina ek-ek table banaye

Tables haath se banane ki zaroorat **nahi** hai. Supabase already SQL editor deta hai:

1. Supabase Dashboard → apna project khol → left menu me **SQL Editor**
2. **New query** pe click
3. Apne project ki file `supabase/migrations/0001_init.sql` ka **poora content** copy karke paste karo
4. **Run** dabao ✅

Isse ek hi baar me: 6 tables + 3 enums + saari RLS security policies + indexes + auto `updated_at` trigger — sab ban jayega.

5. **Phir `supabase/migrations/0002_admin_roles.sql` bhi isi tarah Run karo — ye SKIP mat karna.**

   `0001` har logged-in user ko admin maan leta hai. Supabase me signup by default ON hota hai, matlab koi bhi banda register karke poora content delete kar sakta hai. `0002` ek `admins` allow-list bana deta hai — sirf usme jinke naam hain wahi kuch likh sakte hain. Iske baad file ke last me diya **"SEED THE FIRST ADMIN"** wala snippet apne email ke saath run karna zaroori hai, warna admin panel me login toh hoga par kuch save nahi hoga.

> Sample data bhi chahiye? Uske baad `supabase/seed.sql` ko bhi isi tarah Run kar do (6 courses, 8 faculty, 7 notices, 9 gallery, 4 downloads aa jayenge). Ye optional hai — chaho toh apna data admin panel se daalna.

Neeche di gayi table-by-table detail sirf **samajhne ke liye** hai (agar tum manually Table Editor se banana chahte ho, ya verify karna chahte ho ki sab sahi bana).

---

## 📌 Pehle 3 Enums (custom types) banao

Ye teen "enum" types tables se pehle chahiye (kuch columns inhe use karte hain):

| Enum name | Allowed values | Kahan use hota hai |
|-----------|----------------|--------------------|
| `course_level` | `UG`, `PG` | courses.level |
| `notice_kind` | `notice`, `event` | notices.kind |
| `enquiry_status` | `new`, `read`, `resolved` | enquiries.status |

SQL:
```sql
create type course_level   as enum ('UG', 'PG');
create type notice_kind    as enum ('notice', 'event');
create type enquiry_status as enum ('new', 'read', 'resolved');
```

---

## 🗂️ 6 Tables banane hain

Overview:

| # | Table | Kya store karta hai | Public dekh sakta hai? |
|---|-------|---------------------|------------------------|
| 1 | `courses` | Programmes / academic streams | Haan (published) |
| 2 | `faculty` | Teaching staff profiles | Haan (published) |
| 3 | `notices` | Notices & events feed | Haan (published) |
| 4 | `gallery_images` | Campus photos | Haan (published) |
| 5 | `downloads` | Prospectus, forms, syllabus | Haan (published) |
| 6 | `enquiries` | Contact/admission form submissions | Nahi (sirf admin) |

**Common rule:** har content table me `is_published` (boolean) hota hai — `true` hone par hi public site pe dikhta hai. `sort_order` (number) list ka order decide karta hai (chhota number pehle).

---

### 1️⃣ Table: `courses`

| Column | Type | Required | Default | Description |
|--------|------|:--------:|---------|-------------|
| `id` | uuid | auto | `gen_random_uuid()` | Primary key |
| `name` | text | ✅ | — | Course ka naam (e.g. "Bachelor of Science") |
| `level` | `course_level` | ✅ | — | `UG` ya `PG` |
| `duration` | text | ✅ | — | e.g. "3 years" |
| `tagline` | text | ✅ | — | Ek line ka short summary |
| `about` | text | ✅ | — | Poora description |
| `seats` | integer | ✅ | `0` | Total seats |
| `fee` | text | ✅ | — | Annual fee (e.g. "₹16,000") |
| `subjects` | text[] (array) | ✅ | `{}` | Core subjects ki list |
| `eligibility` | text | ✅ | — | Eligibility criteria |
| `careers` | text[] (array) | ✅ | `{}` | Career paths ki list |
| `sort_order` | integer | ✅ | `0` | Display order |
| `is_published` | boolean | ✅ | `true` | Public pe dikhega ya nahi |
| `created_at` | timestamptz | auto | `now()` | Ban-ne ka time |
| `updated_at` | timestamptz | auto | `now()` | Last edit ka time |

---

### 2️⃣ Table: `faculty`

| Column | Type | Required | Default | Description |
|--------|------|:--------:|---------|-------------|
| `id` | uuid | auto | `gen_random_uuid()` | Primary key |
| `name` | text | ✅ | — | Member ka naam (e.g. "Dr. Anjali Verma") |
| `designation` | text | ✅ | — | e.g. "Professor & Head" |
| `department` | text | ✅ | — | e.g. "Science", "Arts", "Law", "Agriculture" |
| `qualification` | text | ❌ | null | e.g. "Ph.D. Physics" |
| `email` | text | ❌ | null | Contact email |
| `photo_url` | text | ❌ | null | Photo ka URL (Storage ya external link) |
| `bio` | text | ❌ | null | Short profile |
| `sort_order` | integer | ✅ | `0` | Display order |
| `is_published` | boolean | ✅ | `true` | Public pe dikhega ya nahi |
| `created_at` | timestamptz | auto | `now()` | — |
| `updated_at` | timestamptz | auto | `now()` | — |

---

### 3️⃣ Table: `notices`

| Column | Type | Required | Default | Description |
|--------|------|:--------:|---------|-------------|
| `id` | uuid | auto | `gen_random_uuid()` | Primary key |
| `title` | text | ✅ | — | Notice/event ka title |
| `kind` | `notice_kind` | ✅ | `'notice'` | `notice` ya `event` |
| `body` | text | ❌ | null | Poora text |
| `location` | text | ❌ | null | Event ki jagah (e.g. "Main Ground"); notice ke liye null |
| `published_at` | timestamptz | ✅ | `now()` | Publish ki date |
| `is_pinned` | boolean | ✅ | `false` | Pinned = sabse upar dikhega |
| `is_published` | boolean | ✅ | `true` | Public pe dikhega ya nahi |
| `created_at` | timestamptz | auto | `now()` | — |
| `updated_at` | timestamptz | auto | `now()` | — |

---

### 4️⃣ Table: `gallery_images`

| Column | Type | Required | Default | Description |
|--------|------|:--------:|---------|-------------|
| `id` | uuid | auto | `gen_random_uuid()` | Primary key |
| `title` | text | ✅ | — | Photo ka caption |
| `image_url` | text | ✅ | — | Image ka URL (Storage ya external). Placeholder ke liye `#` |
| `category` | text | ❌ | null | e.g. "Events", "Campus", "Academics" |
| `sort_order` | integer | ✅ | `0` | Display order |
| `is_published` | boolean | ✅ | `true` | Public pe dikhega ya nahi |
| `created_at` | timestamptz | auto | `now()` | — |

> Note: is table me `updated_at` nahi hai (photos edit kam hote hain).

---

### 5️⃣ Table: `downloads`

| Column | Type | Required | Default | Description |
|--------|------|:--------:|---------|-------------|
| `id` | uuid | auto | `gen_random_uuid()` | Primary key |
| `name` | text | ✅ | — | Resource ka naam (e.g. "Prospectus 2026–27") |
| `file_url` | text | ✅ | — | File ka URL (Storage ya external). Placeholder ke liye `#` |
| `file_type` | text | ✅ | `'PDF'` | File type (PDF, DOC, etc.) |
| `size_label` | text | ❌ | null | e.g. "4.2 MB" |
| `category` | text | ❌ | null | e.g. "Admissions" |
| `sort_order` | integer | ✅ | `0` | Display order |
| `is_published` | boolean | ✅ | `true` | Public pe dikhega ya nahi |
| `created_at` | timestamptz | auto | `now()` | — |

> Note: is table me bhi `updated_at` nahi hai.

---

### 6️⃣ Table: `enquiries` (public sirf likh sakta hai, padh nahi sakta)

Contact form + Admission form ki submissions yahan aati hain. Sirf admin dekh sakta hai (`/admin/enquiries`).

| Column | Type | Required | Default | Description |
|--------|------|:--------:|---------|-------------|
| `id` | uuid | auto | `gen_random_uuid()` | Primary key |
| `name` | text | ✅ | — | Bhejne wale ka naam |
| `email` | text | ✅ | — | Email |
| `phone` | text | ❌ | null | Phone number |
| `subject` | text | ❌ | null | Subject line |
| `message` | text | ✅ | — | Message body |
| `status` | `enquiry_status` | ✅ | `'new'` | `new` / `read` / `resolved` |
| `created_at` | timestamptz | auto | `now()` | Submit ka time |

---

## 🔒 Security (Row Level Security) — bahut important

Har table pe RLS **on** hona chahiye, warna ya toh public ko kuch nahi dikhega ya sab kuch khula rahega. `0001_init.sql` chalane pe ye automatically set ho jaata hai. Rule:

- **Public (bina login):**
  - `courses`, `faculty`, `notices`, `gallery_images`, `downloads` → sirf `is_published = true` wali rows **padh** sakta hai
  - `enquiries` → kuch bhi seedha nahi kar sakta. Form `submit_enquiry()` function ke through jaata hai, jo ek email se 30 minute me sirf ek message allow karta hai (`supabase/enquiry_cooldown.sql`)
- **Admin:** sirf wo logged-in user jiska id `admins` table me hai (`0002_admin_roles.sql`) — usko har table pe **full read + write**. Sirf login kar lena kaafi **nahi** hai.

> Isliye SQL editor wala tarika best hai — RLS policies bhi khud lag jaati hain. Agar manually table banaoge to RLS policies alag se lagani padegi.

---

## ✅ Setup ke baad ye 3 cheezein zaroor karo

1. **Admin user banao:**
   Supabase Dashboard → **Authentication → Users → Add user** → apna email + password daalo.
   Phir usko `admins` table me daalo — `0002_admin_roles.sql` ke last me diya snippet apne email ke saath run karo. **Dono step zaroori hain.** Sirf user banane se panel khulega toh sahi, par har save "access denied" dega.

2. **Signup band karo:**
   Dashboard → **Authentication → Providers → Email** → "Enable signup" **OFF**.
   (`0002` ke baad naya account waise bhi admin nahi banta, par ajnabi logon ko account banane dene ka koi fayda nahi hai.)

3. **`.env.local` me keys daalo** (project root me, `.env.example` copy karke):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   Ye keys milengi: Supabase → **Project Settings → API**.
   Uske baad `npm run dev` restart karo.

Bas! Login karke jo bhi add/edit/delete karoge, wahi turant public website pe dikhega. 🎉

---

## 📎 Type mapping (agar Supabase Table Editor me manually bana rahe ho)

| Is report me likha | Supabase Table Editor me choose karo |
|--------------------|--------------------------------------|
| uuid | `uuid` (default value: `gen_random_uuid()`) |
| text | `text` |
| text[] (array) | `text` + **Array** toggle on |
| integer | `int8` (ya `int4`) |
| boolean | `bool` |
| timestamptz | `timestamptz` (default: `now()`) |
| `course_level` / `notice_kind` / `enquiry_status` | pehle enum banao, phir "User-Defined types" me se select karo |

**Phir bhi — manually banane se accha `0001_init.sql` Run karna hai.** Kam galti, poori security, ek click.
