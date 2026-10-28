# Submission checklist — Luxury Presence Junior WB

Complete these steps **yourself** (the agent cannot send email or attach your resume).

## Before you email

- [ ] **Deploy latest code** — Push `main` so Vercel serves nav fixes, reference hero (`hero.jpg`), and IDX card links.  
- [ ] **Incognito test** — Open https://marci-websiteredesign.vercel.app/ and click: Search Listings (hero), Listings (header), Find a Home (footer), Property Search → Search (IDX), one Featured Property → View Property (IDX), contact form submit (demo message).  
- [ ] **Resume** — Updated PDF with **mobile number** included.  
- [ ] **Implementation note** — Export [`IMPLEMENTATION-NOTE.md`](IMPLEMENTATION-NOTE.md) to PDF/DOCX; personalize name if needed.

## Email

| Field | Value |
|-------|--------|
| **To** | phcareers@luxurypresence.com |
| **Subject** | `Junior WB Applicant Home Project - Given Name Surname` (exact format) |
| **Body** | Brief intro + **website URL only** (do not lead with GitHub) |
| **Attachments** | Resume + implementation note |

## Verified (2026-10-28)

| Check | Result |
|-------|--------|
| Production URL loads | Yes — https://marci-websiteredesign.vercel.app/ |
| Matches latest local `main` after push | **Pending your push** (local audit fixes not on production until deployed) |
| Responsive QA (375 / 768 / 1280) | No horizontal overflow on localhost; see [`../audits/2026-10-28-homepage-final-audit.md`](../audits/2026-10-28-homepage-final-audit.md) |

## Optional polish (already done locally)

- In-page nav anchors via [`app/lib/siteRoutes.js`](../../app/lib/siteRoutes.js)  
- Reference hero image in `public/images/hero/hero.jpg`  
- Image provenance log: [`../audits/image-provenance.md`](../audits/image-provenance.md)
