# OCR review checkpoint

Updated: 2026-11-01 18:04 KST. Last report scanner: 2026-10-31.1.

## Current scan

- Latest main fetched: 3712653b17987b869606e6138e100163d216d39b. Spreadsheet metadata confirms ocr_errors has 1000 rows and 26 columns. Read A416:J1000; rows416–417 unchanged, rows418–1000 empty. No new reports. Last record row417; next scan starts row418.
- Rows416–417: mount amount OCR-04, general/compatibility, 2026-11-01T07:33:00.227Z / 07:33:19.184Z. Both log 22.49k and the same uploaded image dimensions/size (1080x2340, 429796 bytes). Stored Drive JPEGs each have 70166 bytes. Row416 stored image is 738x1600; visually 22.4k with the summon-info maximum label. No missing leading digit or merge-screen confusion is evident in this stored image.
- Previous investigation replayed scanScreen on row416 stored JPEG with native Canvas and actual local Tesseract eng/kor: amount22.4k, level100, empty progress/target, no diagnostic issues. The amount crop separately returns 22.4k with single-line/sparse OCR and 224k with single-word OCR; pixel decimal validation returns22.4k for all three. Logged extra9 is not reproducible on the stored resized image. This is not original-upload-resolution or live-browser proof; keep rows416–417 unresolved and do not delete9 by assumption. Row417 shares report metadata and stored size but its pixels were not independently replayed.
- No application/backend changes, new tests or new application deployment this scan. Existing main Code checks41287400344 and Pages41287400325 succeeded. No Apps Script deployment necessary. Existing unresolved row415 remains open; no new resolution claimed.

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

- Rows416–417: logged22.49k versus visible22.4k on row416; saved-JPEG replay succeeds. Original upload/browser-resolution evidence is needed to reproduce the failure. Do not force the visible reference into member data.

- Row415: 2026-10-31T15:47:38.338Z, eggMerge selected OCR-04. Original JPEG visually397; logged whole reads397/3974 and isolated3,9,7,empty. Stored-JPEG scanScreen replay returns397 with no issues. Cannot reproduce original browser-resolution failure; do not guess correction or claim browser success.
- Other earlier candidates (green vial location/read failures, other compact maximum/merge captures) remain unverified individually. Do not generalize resolved examples to all screenshots. Reopen original evidence only when pursuing a specific report.
- Never change member inventory, credentials, tickets or clan settings. Do not prepend expected digits or force labels. Confirm corrections with pixels and tests, verify actual Pages success after frontend changes and Google deployment after backend changes.
