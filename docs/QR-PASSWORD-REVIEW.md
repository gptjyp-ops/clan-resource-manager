# QR and password login review — 2026-11-02

User report: issuing a personal QR ticket prevented subsequent password login.
Confirmed cause: issueMemberTicket replaced the only member credential hash with the QR token hash.

Password-based issuance now explicitly preserves the existing salted password hash in private ScriptProperties, scoped to clan and normalized member name and bound to the active credential salt. Login, saving and recovery-code issuance accept either credential; ordinary saves preserve the primary QR credential. QR rotation retains the password and revokes earlier QR tokens. Password replacement/reset changes the credential salt and invalidates the preserved hash. The preceding salt binding tolerates a failed sheet write during issuance. No plaintext password/token is retained or included here.

Previously overwritten password hashes cannot be reconstructed. Existing affected users need the existing authenticated password-change or recovery flow once; this change does not silently reset any live account.

Validation: clan/backend/Google deployment/member-ticket/frontend API/i18n regression scripts, TypeScript check and production build. Automated deployment verification is recorded after the workflow completes. No live member inventory, password, ticket or clan settings were manually changed. OCR review cursor remains unchanged; this review addresses the interactive login report.
