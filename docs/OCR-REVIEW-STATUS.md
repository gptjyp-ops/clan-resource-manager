# OCR review checkpoint

Updated: 2026-10-31 21:05 KST. Scanner: 2026-10-31.1.

## Reviewed range

- Latest main fetched: 235453e. Spreadsheet metadata and ocr_errors A415:A1000 checked; no newer timestamped reports. Last record remains row 414.
- Row 414 (2026-10-31T05:48:22.445Z): eggMerge normal mode, selected OCR-04. Prior original-photo inspection confirmed selected amount 1044, egg-selection upgrade dialog, no decimal or k unit, no leading digit missing from logged full-region OCR.
- Whole-region adaptive readings repeatedly report 1044; isolated readings include 1, 0, 4, 4 followed by an empty read. Selected validation retries when digitBands count disagrees. Reviewed crop scaling and black-pixel threshold path; extra band source is still unconfirmed. Original-image end-to-end replay remains pending. Do not bypass validation based solely on repeated OCR agreement.
- Prior run completed npm ci --ignore-scripts successfully and screen-layout regression checks passed (verified tool output); this corrects the previous checkpoint written before command completion. No application/backend changes or deployment. Original-image replay remains pending; prior photo evidence is retained above.

## Row 414 pixel replay

- Replayed the original JPEG with Pillow bilinear resize to 400px overview and transpiled current screen-layout.ts. This is not browser-canvas end-to-end OCR parity.
- At landmark threshold 160 the accepted components begin at x43 (width6) then x81; the intervening 044 components are missing from the filtered list. Located crop is x=.1025,width=.025 (only the first digit).
- Threshold experiments: 120 yields a two-digit crop; 100 yields four digit components at x44,50,59,69 and crop x=.105,width=.0925, ending before the Korean label at x82. This implicates antialias-connected components plus the width filter; no production threshold change made without compact-PC regression and browser parity checks.
- Keep unresolved. Next concrete step: test strict-threshold landmark pass against compact 672 and original browser canvas, then replay full OCR before deployment.

## Follow-up

- Start new-log reads after row 414. Replay row 414 using current main and inspect selected crop and digitBands output before any fix.
- Rows 412–413: prior confirmed fix for compact desktop egg merge 672 versus 72; not reopened this scan.
- Earlier unresolved candidates remain open: first-digit loss in ordinary egg amounts (e.g. row 381); maximum status on compact captures; green vial location/read failures; small merge dialogs without reliable landmarks. No guessed corrections.
- Do not edit member inventory, credentials, tickets or clan settings. Verify actual Pages deployment after confirmed frontend fixes and Google deployment step after backend changes.
