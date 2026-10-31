# OCR review checkpoint

Updated: 2026-11-01 01:05 KST. Scanner at last report: 2026-10-31.1.

## Current scan

- Latest main fetched: b067fd2. Spreadsheet metadata and ocr_errors A415:A1000 plus A415:J415 checked; one new report, row 415; rows 416–1000 empty.
- No application/backend changes or new tests in this scan. No new application deployment requested. Historical investigation notes below are superseded by the confirmed resolution.

## Resolved: row 414

- Report: 2026-10-31T05:48:22.445Z, eggMerge normal mode, selected OCR-04. Original photo visually confirms 1044, with no decimal/k unit or summon-screen confusion.
- Cause: antialias-connected digits form a wide component discarded by the landmark width filter, narrowing the crop. Global threshold reduction failed compact leading-digit regression and was rejected.
- Fix: split only wide joined components at the strict OCR threshold; retain narrow faint components at original threshold.
- Original Drive JPEG replay using Canvas API (@napi-rs/canvas) and Tesseract returns 1044 with four digit bands. This is not a live browser session. Joined-component and faint-leading-digit regressions pass. All Code checks workflow commands passed locally, including types and build.
- Fix commit: 27db6040b44f1a9cc3ec5c6938709016c8213277. Code checks run 41211057101 and Pages run 41211057045 both completed successfully. Frontend-only change; Google Apps Script deployment unnecessary.
- Do not reopen as unresolved solely because older historical notes said pending.

## Remaining follow-up

- Start new-log reads after row 415; retain unresolved candidates separately.
- Rows 412–413: prior confirmed compact desktop egg merge 672 versus 72 fix.
- Earlier unresolved candidates: ordinary egg amount first-digit loss (e.g. row 381), compact maximum status, green vial location/read failures, and small merge dialogs without reliable landmarks. These original photos were not reopened this scan; no new resolution claimed and no guessed corrections.
- Do not edit member inventory, credentials, tickets or clan settings. Verify Pages after frontend changes and Google deployment after backend changes.

## Original-photo revalidation: 2026-11-01

- Replayed stored Drive JPEGs for row 381 (egg), row 380 (skill), and row 387 (eggMerge) through scanScreen with Canvas API and real Tesseract eng/kor traineddata. Native Canvas shim replaces browser canvas/imagebitmap only; no live-browser claim. Stored JPEG dimensions differ from uploaded file metadata because error evidence is compressed.
- Egg: visual 117k. OCR still returns 17k; validation rejects amount with OCR-04 (no wrong amount accepted). Maximum state now correctly returns level 100.
- Skill: amount 169k correct; maximum label not recognized, level/ratio remain missing with OCR-03.
- EggMerge: visual 210 selected; automatic selected region still missing, OCR-02, no selected value returned.
- All three remain unresolved for their respective fields. No guessed inventory corrections and no application changes or deployment during this verification. Row 414 remains separately resolved.

## Row 415 review

- Report 2026-10-31T15:47:38.338Z, eggMerge, OCR-04 selected; original logged whole reads 397 / 3974, isolated 3,9,7 and empty. Original Drive JPEG visually confirms 397 selected, no decimal/k unit, correct merge screen.
- Replayed through current scanScreen using native Canvas API shim plus real Tesseract eng/kor: selected 397, original reads `397 선택됨` and `397`, no issues. Cannot reproduce on stored compressed JPEG with this runtime; uploaded original browser file differs in dimensions/bytes. Do not infer original-browser success from this replay.
- No new code correction warranted from this evidence; retain as browser/original-resolution follow-up, avoid guessed correction. Next new row starts at 416. Existing user-confirmed labels stored in docs/ocr-user-labels.json; rows 380,381,387 remain unresolved as documented.

## Adaptive dialog width fix

- User-confirmed row 387 expected selected 210 now replays successfully through scanScreen (Canvas API shim + real Tesseract), no issues. Detect gray dialog down to 45% of screenshot width and scale selected-number geometry to detected panel width instead of whole screenshot width.
- Existing screen-layout regressions, scan diagnostics, OCR worker tests, types and build passed locally. GitHub Code checks run 41218334190 and Pages run 41218334202 both successful for commit b610679250fab716bf3b81a613fb4f4d744b156e. Frontend only; Google deployment not required.
- Row 381 117k first-digit OCR loss and row 380 maximum-label recognition remain unresolved. No resource values or clan settings modified. This does not claim support for every device or live-browser replay.
