# OCR review checkpoint

Updated: 2026-10-31 23:59 KST. Scanner at last report: 2026-10-31.1.

## Current scan

- Latest main fetched: eb2d46d. Spreadsheet metadata and ocr_errors A415:A1000 checked; no new timestamped reports. Last record remains row 414.
- No application/backend changes or new tests in this scan. No new application deployment requested. Historical investigation notes below are superseded by the confirmed resolution.

## Resolved: row 414

- Report: 2026-10-31T05:48:22.445Z, eggMerge normal mode, selected OCR-04. Original photo visually confirms 1044, with no decimal/k unit or summon-screen confusion.
- Cause: antialias-connected digits form a wide component discarded by the landmark width filter, narrowing the crop. Global threshold reduction failed compact leading-digit regression and was rejected.
- Fix: split only wide joined components at the strict OCR threshold; retain narrow faint components at original threshold.
- Original Drive JPEG replay using Canvas API (@napi-rs/canvas) and Tesseract returns 1044 with four digit bands. This is not a live browser session. Joined-component and faint-leading-digit regressions pass. All Code checks workflow commands passed locally, including types and build.
- Fix commit: 27db6040b44f1a9cc3ec5c6938709016c8213277. Code checks run 41211057101 and Pages run 41211057045 both completed successfully. Frontend-only change; Google Apps Script deployment unnecessary.
- Do not reopen as unresolved solely because older historical notes said pending.

## Remaining follow-up

- Start new-log reads after row 414; retain unresolved candidates separately.
- Rows 412–413: prior confirmed compact desktop egg merge 672 versus 72 fix.
- Earlier unresolved candidates: ordinary egg amount first-digit loss (e.g. row 381), compact maximum status, green vial location/read failures, and small merge dialogs without reliable landmarks. These original photos were not reopened this scan; no new resolution claimed and no guessed corrections.
- Do not edit member inventory, credentials, tickets or clan settings. Verify Pages after frontend changes and Google deployment after backend changes.

## Original-photo revalidation: 2026-11-01

- Replayed stored Drive JPEGs for row 381 (egg), row 380 (skill), and row 387 (eggMerge) through scanScreen with Canvas API and real Tesseract eng/kor traineddata. Native Canvas shim replaces browser canvas/imagebitmap only; no live-browser claim. Stored JPEG dimensions differ from uploaded file metadata because error evidence is compressed.
- Egg: visual 117k. OCR still returns 17k; validation rejects amount with OCR-04 (no wrong amount accepted). Maximum state now correctly returns level 100.
- Skill: amount 169k correct; maximum label not recognized, level/ratio remain missing with OCR-03.
- EggMerge: visual 210 selected; automatic selected region still missing, OCR-02, no selected value returned.
- All three remain unresolved for their respective fields. No guessed inventory corrections and no application changes or deployment during this verification. Row 414 remains separately resolved.
