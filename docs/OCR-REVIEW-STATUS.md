# OCR review checkpoint

Updated: 2026-10-31 19:03 KST. Scanner: 2026-10-31.1.

## Reviewed range

- Latest main fetched: 59794f5. Spreadsheet metadata and ocr_errors A415:A1000 checked; no newer timestamped reports. Last record remains row 414.
- Row 414 (2026-10-31T05:48:22.445Z): eggMerge normal mode, selected OCR-04. Prior original-photo inspection confirmed selected amount 1044, egg-selection upgrade dialog, no decimal or k unit, no leading digit missing from logged full-region OCR.
- Whole-region adaptive readings repeatedly report 1044; isolated readings include 1, 0, 4, 4 followed by an empty read. Selected validation retries when digitBands count disagrees. Reviewed crop scaling and black-pixel threshold path; extra band source is still unconfirmed. Original-image end-to-end replay remains pending. Do not bypass validation based solely on repeated OCR agreement.
- Previous screen-layout regression invocation failed before execution because TypeScript was not installed. Runtime dependency directory also lacks TypeScript. Attempted npm ci --ignore-scripts to restore dependencies this run; completion not yet verified. No test pass is claimed. No application/backend changes or deployment. Original-image replay remains pending; prior photo evidence is retained above.

## Follow-up

- Start new-log reads after row 414. Replay row 414 using current main and inspect selected crop and digitBands output before any fix.
- Rows 412–413: prior confirmed fix for compact desktop egg merge 672 versus 72; not reopened this scan.
- Earlier unresolved candidates remain open: first-digit loss in ordinary egg amounts (e.g. row 381); maximum status on compact captures; green vial location/read failures; small merge dialogs without reliable landmarks. No guessed corrections.
- Do not edit member inventory, credentials, tickets or clan settings. Verify actual Pages deployment after confirmed frontend fixes and Google deployment step after backend changes.
