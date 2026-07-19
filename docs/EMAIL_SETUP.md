# Email setup (free, no domain needed)

Two separate emails use SMTP. Both are **optional** — the site works without them.

1. **New-enquiry alert** → your app sends it (config in `.env.local`).
2. **Password-reset email** → Supabase Auth sends it (config in the Supabase dashboard).

We'll use **Gmail SMTP** — free, works on localhost, no domain required. (Later, on a
real domain, swap to Resend by changing only the SMTP values — no code changes.)

---

## Step 1 — Create a Gmail "App Password"

App Passwords need 2-Step Verification on.

1. Google Account → **Security** → turn on **2-Step Verification** (if not already).
2. Then go to **Security → App passwords** (or visit myaccount.google.com/apppasswords).
3. Create one named e.g. "Nalanda site". Google shows a **16-character password** — copy it.
   (It's shown once. It looks like `abcd efgh ijkl mnop` — you can paste it with or without spaces.)

---

## Step 2 — Enquiry alerts (your app)

In `.env.local`, fill these, then restart `npm run dev`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=the16charAppPassword
SMTP_FROM=youremail@gmail.com
ADMIN_NOTIFY_EMAIL=youremail@gmail.com   # where alerts land (defaults to SMTP_USER)
```

Test: submit an enquiry on `/contact` or `/admissions` → an email arrives in your inbox.
(If SMTP is blank, the enquiry still saves — you just don't get an email.)

---

## Step 3 — Password-reset email (Supabase dashboard)

This is set in Supabase, not in code:

1. Supabase Dashboard → **Project Settings → Authentication → SMTP Settings**.
2. **Enable Custom SMTP** and enter:
   - Host: `smtp.gmail.com`  ·  Port: `587`
   - Username: `youremail@gmail.com`  ·  Password: the **same App Password**
   - Sender email / name: your Gmail + "Nalanda College"
3. Save. Now `/admin/forgot-password` will actually email the reset link.

> Also add your site URL under **Authentication → URL Configuration → Redirect URLs**
> (e.g. `http://localhost:3000/auth/callback`) so the reset link is accepted.

---

## Limits & notes
- Gmail free: ~500 emails/day — plenty for a college's enquiries.
- Deliverability from a `@gmail.com` sender is fine for low volume; on a real domain,
  switch to Resend (`SMTP_HOST=smtp.resend.com`, port `465`, user `resend`, pass = API key)
  for professional `@yourcollege.edu.in` sending.
- Never commit `.env.local` (it's gitignored).
