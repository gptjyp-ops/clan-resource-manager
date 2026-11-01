# OCR review checkpoint

Updated: 2026-11-01 09:58 KST. Last report scanner: 2026-10-31.1.

## Current scan

- Latest main fetched: 5e30ed9. Spreadsheet metadata and ocr_errors A416:A1000 read; no new reports. Last record is row415. Next scan starts at row416.
- No application/backend changes or tests performed this scan; no new application deployment requested. Row415 remains open with the previously documented original-resolution replay limitation; no new resolution claimed. Earlier investigation history is preserved in Git history; current status below supersedes old pending notes.

## Resolved cases

| Rows | Confirmed behavior and change | Fix commit | Successful Code checks / Pages runs |
| --- | --- | --- | --- |
| 380 | 169k + maximum; Korean maximum-label OCR uses sparse text | 3ae4a92fb3a6c51c3a81bca859f6d04f92d778f8 | 41222112749 / 41222112669 |
| 381 | 117k repeated leading 1 recovered from independent glyph reads and amountDecimal validation | 0028572b454661e27003dcd23b2d4a1e7c4363c2 | 41246610819 / 41246610846 |
| 387 | Selected210 located relative to detected dialog width on wide screenshot | b610679250fab716bf3b81a613fb4f4d744b156e | 41218334190 / 41218334202 |
| 414 | Selected1044; split wide antialias-connected glyph components while retaining faint narrow digits | 27db6040b44f1a9cc3ec5c6938709016c8213277 | 41211057101 / 41211057045 |

- User-confirmed labels are in docs/ocr-user-labels.json. Replays used stored compressed Drive JPEGs, native Canvas and real Tesseract; not live-browser proof. Row381 validation was crop-level, not full scanScreen end-to-end. All listed changes are frontend-only; Apps Script deployment unnecessary.
- Rows412–413: earlier confirmed compact egg merge672 versus72 fix, retained as resolved.

## Open follow-up

- Row415: 2026-10-31T15:47:38.338Z, eggMerge selected OCR-04. Original JPEG visually397; logged whole reads397/3974 and isolated3,9,7,empty. Stored-JPEG scanScreen replay returns397 with no issues. Cannot reproduce original browser-resolution failure; do not guess correction or claim browser success.
- Other earlier candidates (green vial location/read failures, other compact maximum/merge captures) remain unverified individually. Do not generalize resolved examples to all screenshots. Reopen original evidence only when pursuing a specific report.
- Never change member inventory, credentials, tickets or clan settings. Do not prepend expected digits or force labels. Confirm corrections with pixels and tests, verify actual Pages success after frontend changes and Google deployment after backend changes.
