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

## 2026-11-01 02:00 KST scan and maximum-label fix

- Latest main inspected: 98824eb; metadata and A416:A1000 read, no new reports; last row 415. Next scan starts at row 416.
- User-confirmed row 380 original replay: changing only Korean maximum-status OCR segmentation from SINGLE_LINE to SPARSE_TEXT yields amount 169k and level 100 (maximum), with empty progress/target. Original three-photo replay also retains egg maximum and merge selected 210; egg 117k amount remains rejected, unresolved.
- Screen-layout and scan-diagnostics regressions, TypeScript and build passed locally. Commit 3ae4a92fb3a6c51c3a81bca859f6d04f92d778f8 Code checks run 41222112749 and Pages run 41222112669 both completed successfully. Frontend-only, no Apps Script deployment needed.
- Row 380 maximum-label issue now resolved by stored-JPEG native Canvas/Tesseract replay (not live browser). Row 381 remains unresolved; row 415 original-browser mismatch remains follow-up. No member resources, credentials, tickets, or settings changed.

## 2026-11-01 03:03 KST scan

- Latest main fetched: 55c89c1. Spreadsheet metadata and ocr_errors A416:A1000 read; no new records, last remains row 415. Next new-log read starts at row 416.
- Inspected latest screen-ocr.ts amount validation path. When `17k` is syntactically valid but amountDecimal rejects its glyph count, current code rejects immediately; its retry branch handles only a missing suffix on digit-only reads. There is no alternate full-amount segmentation retry for an already-present k suffix. This is a candidate improvement path, not a confirmed fix or permission to prepend a guessed 1.
- Prior temporary original-replay workspace and JPEGs were removed by workspace maintenance. Fresh original evidence and replay harness must be restored before validating any amount-retry candidate. No code changes, test pass or deployment claimed in this run.
- Row 381 remains unresolved; rows 380,387,414 retain their previously verified fixes. Member data/settings untouched.

## 2026-11-01 04:04 KST scan

- Latest main fetched: b5ce658. Spreadsheet metadata and ocr_errors A416:A1000 checked; no new reports; last remains row 415.
- Recovered row 381 stored original JPEG from Drive into scratch as ocr-381.jpg, and prepared isolated latest-main worktree ocr-review. These are temporary; refetch original after maintenance rather than assuming deletion by user.
- Existing screen-layout and scan-diagnostics regression commands executed on isolated latest main; no amount retry candidate or original end-to-end replay validated in this run. Row 381 remains open. Next work should restore Canvas/Tesseract replay harness, then compare alternate PSM outputs with amountDecimal before any correction; never prepend a literal 1 based on expected label.
- No application/backend modifications or deployment; member data and settings unchanged. Next new-log read starts at row 416. Prior deployed fixes remain resolved.

## 2026-11-01 05:08 KST scan and amount replay

- Latest main fetched: d5709d7; metadata and A416:A1000 checked, no new reports; last 415.
- Restored native Canvas dependency and reproduced current amount crop/threshold/cleanAmountPixels/padding from row 381 stored original with real Tesseract eng. PSM SINGLE_LINE => 17k, SINGLE_WORD => mk, SPARSE_TEXT => 17k; amountDecimal returns null for all three. Therefore simple alternate segmentation retries do NOT fix this original; do not deploy such a change as resolved.
- No production code modified, no guessed correction, no new deployment. Row 381 remains unresolved. Next investigate crop pixels/glyph separation or independent character recognition with unit and decimal validation. Prior fixed rows stay resolved; next new-log read row 416.

## 2026-11-01 06:00 KST scan and glyph evidence

- Latest main fetched: 4799ba0. Metadata and A416:A1000 checked; no new records, last 415.
- Recovered Canvas dependency under workspace ocr-tools rather than /tmp. Glyph replay of row381 stored JPEG shows four bands: (x216,w35,h71), (x264,w34,h71), (x311,w49,h71), (x372,w53,h77). Visually inspected thresholded crop: complete 117k, not a clipped leading digit.
- Real Tesseract SINGLE_CHAR on each independently padded glyph returns 1,1,7,k. Whole-string modes remain 17k/mk/17k and all fail amountDecimal validation. This narrows this case to whole-string OCR dropping a repeated 1, not location failure.
- Next candidate: bounded per-glyph fallback only after whole-amount validation fails, preserve decimal/unit checks, validate reconstructed amount with amountDecimal. No literal expected digits may be injected. Candidate not yet implemented or regression-tested, no production deployment.
- Earlier deployed fixes stay resolved, member resources/settings untouched. Next new-log read starts at row416.

## 2026-11-01 07:08 KST: row381 recovery deployed

- Metadata and A416:A1000 checked; no new records, last415. Latest main inspected before fix: 6b9ed53.
- Added bounded independent-glyph OCR fallback only after pixel validation rejects integer-with-unit whole-string OCR. Each numeric glyph and terminal k/m/b must be read independently; reconstructed text must pass amountDecimal. No expected label is injected. Decimal-bearing inputs do not take this integer fallback.
- Original row381 stored JPEG crop replay with native Canvas + real Tesseract: whole string17k fails, glyphs1,1,7,k reconstruct117k and amountDecimal validates117k. This is crop-level native replay, not live-browser end-to-end proof.
- Screen-layout, scan-diagnostics, OCR-worker tests, types/build passed locally. Fix commit0028572b454661e27003dcd23b2d4a1e7c4363c2: Code checks41246610819 and Pages41246610846 both success. Frontend only, no Google deployment needed. Row381 confirmed stored-original case resolved; row415 original browser-resolution follow-up still open. No member resources/settings changed.
