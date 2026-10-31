# OCR review checkpoint

Updated: 2026-10-31 17:00 KST. Scanner: 2026-10-31.1.

## Reviewed range

- Latest main fetched: 87b4aeb. Spreadsheet metadata and ocr_errors A415:A1000 checked; no newer timestamped reports. Last record remains row 414.
- Row 414 (2026-10-31T05:48:22.445Z): eggMerge normal mode, selected OCR-04. Original Drive JPEG downloaded and visually inspected this run: actual selected amount is 1044. It is an egg-selection upgrade dialog, not an ordinary summon screen. No decimal or k unit is present and no leading digit is missing in the logged full-region OCR.
- Whole-region adaptive readings repeatedly report 1044; isolated readings include 1, 0, 4, 4 followed by an empty read. Inspected screen-ocr.ts selected validation: disagreement with digitBands count triggers per-character retries and OCR-04 on failed validation. This suggests an extra detected band, but its pixel source has not been replayed/confirmed. Keep row 414 unresolved until reproducing the extra band; do not bypass validation based solely on repeated OCR agreement.
- No application/backend changes, tests or deployment this run.

## Follow-up

- Start new-log reads after row 414. Replay row 414 using current main and inspect the selected crop and digitBands output before any fix.
- Rows 412–413: prior confirmed fix for compact desktop egg merge 672 versus 72; not reopened this scan.
- Earlier unresolved candidates remain open: first-digit loss in ordinary egg amounts (e.g. row 381); maximum status on compact captures; green vial location/read failures; small merge dialogs without reliable landmarks. No guessed corrections.
- Do not edit member inventory, credentials, tickets or clan settings. Verify actual Pages deployment after confirmed frontend fixes and Google deployment step after backend changes.
