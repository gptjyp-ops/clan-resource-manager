# User-supplied tablet OCR review — 2026-11-12

Scope: six original 1248×1972 JPEGs supplied in this conversation. No member data was written. Private images, nicknames and attachment URLs are not committed. This is a direct-image review; the automated ocr_errors checkpoint is unchanged.

Original-image baseline: mount 11.2k/max, mount merge 2082, green potion 0, egg merge 91, egg 27.7k/max all passed. Skill 27.7k / level 74 incorrectly returned 0/0 for the visible 90/110. A retry could also return 30/110 because the mixed-color crop included yellow stars beneath the white digits.

Changes: reject zero-denominator ratios; try the full detected progress bar with white-only pixels before raw/mixed alternatives. If amount text is syntactically invalid or empty, retry the exact same pixels with word/sparse segmentation, retaining the existing independent digit-count, decimal and compact-unit validation. This handles compressed repeated 1s misread as M and a lone zero missed by line segmentation without substitution rules. Diagnostic version is now 2026-11-12.1.

Verification: actual local Tesseract with original English/Korean language data, all six originals and resampled/re-encoded 75% and 50% images (18/18 pass). Expected outputs:

| Slot | Read |
| --- | --- |
| Mount summon | 11.2k, max level 100 |
| Mount merge | 2082 selected |
| Green potion | 0 (red potion 67.7k is a different resource) |
| Egg merge | 91 selected |
| Egg summon | 27.7k, max level 100 |
| Skill summon | 27.7k, level 74, 90/110 |

Existing original evidence cases 495, 503, 510 and 516 were replayed without new errors. Layout, cancel/maximum retry, diagnostics, i18n, worker, TypeScript and production build checks passed. Tests cover invalid zero targets, valid zero progress, invalid compact-unit text and white-only full-bar retry ordering. Images are transient test inputs only; no screenshot-specific numeric correction is encoded.

Deployment verified: fix commit `0dcf1df91e61189c8297c69d50050d901455dd32`; Code checks run 43211234476 and Pages run 43211234484 succeeded, including the actual deploy-pages step. The public site returned bundle `index-CgC_2YwG.js`, fetched successfully and confirmed to contain diagnostic version 2026-11-12.1 and the new segmentation retry. Frontend only; no Google Apps Script change required. Password recovery remains a separate user-controlled workflow.
