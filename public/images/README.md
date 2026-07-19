# Brand images — drop your files here

Put your image files in this folder (`public/images/`) with the **exact filenames**
below. They appear automatically — no code changes needed. Until a file exists, the
site shows a graceful fallback (a gradient / placeholder), so nothing ever breaks.

> After adding files, refresh the browser (hard-reload). No rebuild needed in dev.

## ✅ Auto-wired — just add the file with this exact name

| Filename | Where it shows | Recommended size | Format | Notes |
|----------|----------------|------------------|--------|-------|
| `hero.jpg` | Home page — big hero background | **1920 × 1080** (16:9) | JPG / WebP | Landscape campus photo. Keep it light (< ~300 KB) — a dark navy overlay sits on top for text readability, so a slightly darker photo works best. |
| `university-logo.svg` | About page — "Affiliation" banner | any (vector) | **SVG** or transparent PNG | The affiliating university's logo. SVG stays crisp at any size. |
| `principal.jpg` | About page — Principal's message | **400 × 400** (square) | JPG | Head-and-shoulders photo, face centred (it's shown in a rounded square, cropped to cover). |
| `og-image.jpg` | Link previews (WhatsApp / Facebook / X) | **1200 × 630** | JPG | Shown when someone shares the site link. Big SEO / social win. Put the college name + logo on it. |

Principal's name is set in `src/config/site.ts` (`principal.name`) — currently
**"Dr. Anand Mohan Sharma"**. Change it there any time.

## 🎨 Optional — extra images that improve branding, SEO & speed

These are **not** in `public/images/` — they use Next.js's built-in icon convention.
Drop them straight into `src/app/` and Next.js picks them up automatically:

| File (in `src/app/`) | Purpose | Size |
|----------------------|---------|------|
| `icon.png` | Browser-tab favicon | 512 × 512 |
| `apple-icon.png` | iOS "Add to Home Screen" icon | 180 × 180 |

Want a **college logo in the navbar & footer** (instead of the text name)? Add
`public/images/logo.png` (transparent PNG, ~200 × 200) **and tell me** — I'll wire it
into the header and footer for you (couple of minutes).

## Speed tips
- Compress photos before adding (e.g. squoosh.app / tinypng.com). Hero especially —
  aim for < 300 KB. Smaller files = faster load = better SEO score.
- WebP is smaller than JPG at the same quality — use it for `hero` if you can.
