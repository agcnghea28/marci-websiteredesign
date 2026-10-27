# Project updates

This folder is for **planning, audits, and progress notes only**. It is separate from application code (`app/`, `public/`, etc.) so you can track reviews and submission checklists without mixing them into the site.

## Structure

```
project-updates/
  README.md           ← this file
  audits/             ← dated audit reports (QA, assignment rubric, pre-submit reviews)
    _template.md      ← copy when starting a new audit
    YYYY-MM-DD-*.md   ← one file per audit
```

## Audits index

| Date | Document | Summary |
|------|----------|---------|
| 2026-10-28 | [Junior WB site QA audit](audits/2026-10-28-junior-wb-site-qa-audit.md) | Home-page revamp vs Luxury Presence assignment; gaps, deliverables, priorities |

_Add new rows when you add audits._

## Adding a future audit

1. Copy `audits/_template.md` to `audits/YYYY-MM-DD-short-title.md`.
2. Fill in metadata, findings, and action items.
3. Add a row to the **Audits index** table above.

Do not put runtime config, secrets, or source code here—only documentation and checklists.
