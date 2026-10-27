# Site QA gap audit — Junior WB Assignment alignment

| Field | Value |
|-------|--------|
| **Date** | 2026-10-28 |
| **Scope** | Full single-page home revamp; header, footer, sections, contact API |
| **Reference** | [marcimetzger.com](https://marcimetzger.com/) Home only; Luxury Presence Junior Website Builder assignment |
| **Build** | Next.js app in `app/page.js`; deploy URL noted in footer as `marci-websiteredesign.vercel.app` |

---

## Assignment rubric scorecard

| Requirement | Status | Notes |
|-------------|--------|--------|
| Revamp **Home only**, single page | **Met** | One route `/`; all sections on one scroll page. |
| **Improve** design (not copy-paste layout) | **Met** | Custom layout, typography, carousels, parallax hero, component CSS modules—clearly beyond a template swap. |
| Use **all content** from reference page | **Mostly met** — verify | Core copy blocks present (sales stats, sellers, buyers, three service narratives, contact/hours). Some **reference headings/labels** renamed or omitted (see content parity). |
| Use **images from reference** (download from site) | **Verify manually** | Hero is custom `hero.jpg` (may not be reference `mtn falls pond` image). Featured/gallery/meet-marci assets need spot-check vs GoDaddy site. |
| May **add** extra content | **Met** (optional extras) | Featured Properties, Testimonials, Photo Gallery, expanded Meet Marci, logo marquee, contact form—allowed. |
| **Responsive** mobile / tablet / desktop | **Likely met** — must test | Code is mobile-first; assignment requires you **prove** no overlap / horizontal scroll on all three. |
| **Free hosting** + share **URL only** (not GitHub) | **Partially ready** | Vercel URL exists; do **not** submit repo link. Ensure URL is public and stable before email. |
| Frameworks allowed | **Met** | Next.js 16 + React; assignment permits this. |
| AI use with **your** judgment & explainability | **Met if documented** | Write implementation note; be ready to explain choices in interview. |

---

## Submission deliverables (non-code — assignment blockers)

These are **not in the codebase**; hiring will reject or delay without them:

| Deliverable | Status |
|-------------|--------|
| **Website URL** (accessible, viewable) | Confirm production deploy; test in incognito. |
| **Updated resume** including **mobile number** | You must attach separately. |
| **Implementation note** (brief): tools/frameworks + **one specific design decision** and how it improved the reference | **Missing** — create a short PDF or doc (do not rely on default `README.md`). |
| Email to **phcareers@luxurypresence.com** only | You send when ready. |
| Subject: `Junior WB Applicant Home Project - Given Name Surname` | Exact format required. |

**Do not** email GitHub links as the primary deliverable.

---

## Reference Home content parity ([marcimetzger.com](https://marcimetzger.com/))

Mapped from live Home text vs your sections:

| Reference (Home) | Your implementation | Gap? |
|------------------|---------------------|------|
| **Pahrump Realtor** + MARCI METZGER eyebrow | `app/components/Hero.js` | OK |
| **REALTOR FOR NEARLY 3 DECADES** + phone in hero area | Phone via **Call Now** only; decade line on **Meet Marci** (`#about`) | **Minor:** reference bundles tagline + phone in hero; consider adding tagline/phone near hero H1 for parity |
| **GET IT SOLD** (section branding) | Split: **Top Residential Sales** (`#sales`, eyebrow “Proven Results”) + **Don't Just List It** (`#sellers`) | **Minor:** “GET IT SOLD” headline not used verbatim as section title |
| Top Residential Sales copy (90 clients / $28.5M) | `app/components/TopResidentialSales.js` | OK |
| Don't Just List… / Get it SOLD copy | `app/components/HomeSellers.js` | OK |
| Guide to Buyers copy | `app/components/GuideToBuyers.js` | OK |
| **Find Your Dream Home** / **Search Listings** | Hero `app/components/ListingSearch.js` `#search` | **Minor:** no “Find Your Dream Home” heading above search |
| Three service paragraphs (nervous adventure / commercial / affordability) | `app/components/OurServices.js` three cards | OK (titles reframed) |
| Address, phone, office hours, appointments note | `app/components/ContactSection.js` | OK |
| Reference hero/section **images from site** | Mixed local assets under `public/images/` | **Action:** confirm each key visual was downloaded from reference (assignment rule) |

**Extra sections (allowed):** Featured Properties, Meet Marci bio, Testimonials, Photo Gallery, footer CTA band, partner logo marquee.

---

## Functionality & links (what works / what fails)

### Working (good for demo URL)

- Hero + header **listing search → IDX** (`app/lib/listingSearch.js`).
- **Featured Properties** carousel, Maps on address, IDX detail links.
- **Home Sellers** / **Gallery** / **Testimonials** carousels (drag, dots, lightbox on gallery).
- **Contact** validation, map, `tel:` links, socials.
- Header: scroll behavior, mobile menu, search overlay.

### Broken, placeholder, or risky for reviewers

| Issue | Assignment impact |
|-------|-------------------|
| Footer **Privacy** / **Terms** → `href="#"` | Looks unfinished; remove, link to real pages, or hide until real URLs exist. |
| Footer **Home** / **Gallery** hardcode `marci-websiteredesign.vercel.app` | Wrong if URL changes; use `/` and `/#gallery`. |
| Header desktop nav sends users to **marcimetzger.com** (Listings, Let's Move, About Us) | Undermines “single revamped page”; prefer in-page `#` anchors or IDX/listings URLs framed as intentional. |
| Desktop vs **mobile menu** link sets differ | UX inconsistency; align for professional polish. |
| **Contact email API** needs `.env` on Vercel | Submit may **error** for graders unless env configured **or** you document “demo: validation only.” Assignment does not require email—only user-friendly site. |
| IDX **amenity** query params | May not filter on IDX; quick test before demo. |

### Not required by assignment (LP-style extras)

IDX/MLS disclaimer block, sitemap/robots, Open Graph, skip-link—these are **nice-to-have**, not rubric blockers.

---

## AI & originality (assignment language)

Reviewers expect more than font/color swaps. The project **already shows**:

- Custom section architecture and motion (parallax, 3D testimonial stage, marquees).
- IDX-integrated search (beyond static reference).

**Strengthen submission by:**

- Implementation note explaining **one** deliberate design move (e.g. hero search as sticky lead-gen, testimonial depth carousel, consolidating “GET IT SOLD” into two visual bands).
- Being able to walk through **your** component structure in an interview.

---

## Recommended manual QA (assignment: all three breakpoints)

1. **375px** — menu, hero search grid, carousels, contact form, no horizontal scroll.
2. **768px** — tablet layouts for split sections (sales, buyers, contact map/form).
3. **1280px+** — header nav + search; featured properties card width.

Plus: every button/link once; contact form success/error paths; IDX search from hero.

---

## Open action items

| ID | Priority | Task | Status |
|----|----------|------|--------|
| rubric-content-parity | P0 | Verify every reference Home headline/copy block; confirm images sourced from marcimetzger.com | Pending |
| responsive-qa-three-breakpoints | P0 | Test mobile, tablet, desktop—no overlap, horizontal scroll | Pending |
| submission-deliverables | P0 | URL + resume + implementation note; email phcareers | Pending |
| pre-submit-polish | P1 | Dead legal links; relative footer URLs; header nav alignment | Pending |
| contact-form-production | P1 | Vercel env for email or demo-only UX | Pending |

### P0 (assignment / deliverables)

1. **Public URL** works; email contains **URL only** + resume + implementation note.
2. **Content parity check:** add missing reference labels if easy (“Find Your Dream Home”, hero “Nearly 3 Decades” / phone, optional “GET IT SOLD” eyebrow).
3. **Image provenance:** replace or justify hero/section images per “download from website” rule.
4. **Responsive pass** on three breakpoints with fixes for any overflow/overlap.

### P1 (professional polish for graders)

1. Fix dead **Privacy/Terms** and footer absolute URLs.
2. Harmonize **header navigation** (in-page anchors vs external site).
3. Contact form: configure Vercel env **or** show clear success path graders can use without SMTP.

### P2 (optional)

Testimonial avatars, typo “Cherly”, OG meta, IDX disclaimer near featured listings.

---

## Suggested implementation note outline (for your deliverable doc)

1. **Tools:** Next.js 16, React 19, CSS Modules, Vercel hosting, IDX Broker query integration, optional Nodemailer/Resend for contact API.
2. **One design decision (example angles—pick your real story):**
   - Elevated listing search into hero with segmented filters → clearer “Find Your Dream Home” job than reference static block.
   - Split “GET IT SOLD” into stats + seller carousel → separates proof from emotional CTA.
   - Testimonials/gallery as added trust/lifestyle layers for a real estate brand.

Keep to **one page**, plain language, 2–4 short paragraphs.
