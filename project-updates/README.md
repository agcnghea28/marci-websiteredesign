# Project updates

This folder is for **planning, audits, and progress notes only**. It is separate from application code (`app/`, `public/`, etc.) so you can track reviews and submission checklists without mixing them into the site.

## Structure

```
project-updates/
  README.md           ← this file
  submission/         ← implementation note + email checklist (not sent automatically)
  audits/             ← dated audit reports (QA, assignment rubric, pre-submit reviews)
    _template.md      ← copy when starting a new audit
    YYYY-MM-DD-*.md   ← one file per audit
```

## Audits index

| Date | Document | Summary |
|------|----------|---------|
| 2026-10-28 | [Junior WB site QA audit](audits/2026-10-28-junior-wb-site-qa-audit.md) | Initial rubric pass (partially superseded) |
| 2026-10-28 | [Homepage final audit](audits/2026-10-28-homepage-final-audit.md) | Post-polish audit + remediation (nav, hero image, QA) |
| 2026-10-28 | [Image provenance](audits/image-provenance.md) | Reference hero download log |

## Submission

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION-NOTE.md](submission/IMPLEMENTATION-NOTE.md) | Attach to phcareers email |
| [SUBMISSION-CHECKLIST.md](submission/SUBMISSION-CHECKLIST.md) | URL, resume, deploy, email steps |

_Add new rows when you add audits._

## Adding a future audit

1. Copy `audits/_template.md` to `audits/YYYY-MM-DD-short-title.md`.
2. Fill in metadata, findings, and action items.
3. Add a row to the **Audits index** table above.

Do not put runtime config, secrets, or source code here—only documentation and checklists.
