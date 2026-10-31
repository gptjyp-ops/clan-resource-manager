# OCR review checkpoint

Updated: 2026-10-31 23:02 KST. Scanner: 2026-10-31.1.

## Reviewed range

- Latest main fetched: 55b20b1. Spreadsheet metadata and ocr_errors A415:A1000 checked; no newer timestamped reports. Last record remains row 414.
- Row 414 (2026-10-31T05:48:22.445Z): eggMerge normal mode, selected OCR-04. Prior original-photo inspection confirmed selected amount 1044, egg-selection upgrade dialog, no decimal or k unit, no leading digit missing from logged full-region OCR.
- Whole-region adaptive readings repeatedly report 1044; isolated readings include 1, 0, 4, 4 followed by an empty read. Selected validation retries when digitBands count disagrees. Reviewed crop scaling and black-pixel threshold path; extra band source is still unconfirmed. Original-image end-to-end replay remains pending. Do not bypass validation based solely on repeated OCR agreement.
- Prior run completed npm ci --ignore-scripts successfully and screen-layout regression checks passed (verified tool output); this corrects the previous checkpoint written before command completion. No application/backend changes or deployment. Original-image replay remains pending; prior photo evidence is retained above.

## Row 414 pixel replay

- Replayed the original JPEG with Pillow bilinear resize to 400px overview and transpiled current screen-layout.ts. This is not browser-canvas end-to-end OCR parity.
- At landmark threshold 160 the accepted components begin at x43 (width6) then x81; the intervening 044 components are missing from the filtered list. Located crop is x=.1025,width=.025 (only the first digit).
- Threshold experiments: 120 yields a two-digit crop; 100 yields four digit components at x44,50,59,69 and crop x=.105,width=.0925, ending before the Korean label at x82. This implicates antialias-connected components plus the width filter; no production threshold change made without compact-PC regression and browser parity checks.
- Keep unresolved. Next concrete step: test strict-threshold landmark pass against compact 672 and original browser canvas, then replay full OCR before deployment.

## Threshold regression result

- Temporarily changed selected landmark threshold 160 to 100 and ran scripts/test-screen-layout.mjs. Regression failed at line 216: compact leading curved digit disappeared (actual x51,width11 versus expected x44,width18). This disproves a global threshold-only fix.
- Restored source exactly; git status clean. No production code committed or deployed. Row 414 remains unresolved.
- Next approach must preserve faint compact leading digits while splitting antialias-connected multi-digit components (e.g. separate threshold passes with conservative crop boundary validation). Do not apply the failed strict threshold globally.

## Latest source review

- Main now includes the separate clan bot change (55b20b1). Compared its changed paths and inspected main screen-layout.ts: selected landmark logic is unchanged. Do not overwrite or deploy older local sources over the bot update.
- Re-read compact leading-digit regression at test-screen-layout.mjs lines 205–216: gray 130-level bridges are intentionally required to reconnect a faint leading digit. A replacement must preserve these components; no further production candidate has been validated this run. Original browser-canvas replay remains pending.
- No application changes, tests, or deployment in this scan; no inventory, credentials, tickets, or clan settings touched.

## Follow-up

- Start new-log reads after row 414. Replay row 414 using current main and inspect selected crop and digitBands output before any fix.
- Rows 412–413: prior confirmed fix for compact desktop egg merge 672 versus 72; not reopened this scan.
- Earlier unresolved candidates remain open: first-digit loss in ordinary egg amounts (e.g. row 381); maximum status on compact captures; green vial location/read failures; small merge dialogs without reliable landmarks. No guessed corrections.
- Do not edit member inventory, credentials, tickets or clan settings. Verify actual Pages deployment after confirmed frontend fixes and Google deployment step after backend changes.

## Confirmed fix: row 414

- Fixed wide antialias-connected selected-number components by splitting only wide components at OCR's strict black threshold. Narrow faint components retain the original threshold, preserving compact leading digits.
- Replayed original Drive JPEG with Canvas API (@napi-rs/canvas) and Tesseract: selected crop contains four digit bands and recognizes 1044. This is Canvas API replay, not a live browser session. Added joined-component regression; existing faint leading digit checks pass.
- All commands from Code checks workflow passed locally, including TypeScript and production build. Frontend-only change; Google Apps Script deployment unnecessary. Fix commit 27db6040b44f1a9cc3ec5c6938709016c8213277: Code checks run 41211057101 and Publish GitHub Pages run 41211057045 both completed successfully. Row 414 confirmed fix deployed.
- Earlier unresolved reports remain open; member resources, credentials, tickets and clan settings untouched.
