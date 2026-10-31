# OCR review checkpoint

Updated: 2026-10-31 (Korea time). Scanner: 2026-10-31.1.

## Reviewed range

- ocr_errors rows 412–413: same compact desktop egg-merge screenshot, standard and compatibility. Original shows 672 selected; labelled recognition read 672 while numeric region read 72.
- Fixed numeric landmark detection: retain anti-aliased fragments in short digits and scale the gap separating the selected count from its following label. Independent labelled/numeric disagreement checks remain enabled.
- Original screenshot replay now returns selected=672 with no issues. Synthetic regression checks cover shorter and fragmented leading digits and exclusion of following label.

## Follow-up

- Start new-log reads after row 413; inspect earlier unresolved reports separately. Do not treat every OCR-04 as a false alarm.
- Earlier review candidates, not fixed by this change: first-digit loss in ordinary egg amounts (e.g. row 381); maximum status on compact captures; green vial location/read failures; small merge dialogs without reliable landmarks. Reopen original photos before drawing conclusions.
- Do not edit member inventory, credentials, tickets or clan settings during automated review. Record confirmed fixes and verify Pages deployment; verify Google deployment step only when backend changed.
