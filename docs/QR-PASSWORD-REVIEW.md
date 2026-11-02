# QR and password login review — 2026-11-02

User report: issuing a personal QR ticket prevented subsequent password login.
Confirmed cause: issueMemberTicket replaced the only member credential hash with the QR token hash.

Password-based issuance now explicitly preserves the existing salted password hash in private ScriptProperties, scoped to clan and normalized member name and bound to the active credential salt. Login, saving and recovery-code issuance accept either credential; ordinary saves preserve the primary QR credential. QR rotation retains the password and revokes earlier QR tokens. Password replacement/reset changes the credential salt and invalidates the preserved hash. The preceding salt binding tolerates a failed sheet write during issuance. No plaintext password/token is retained or included here.

Previously overwritten password hashes cannot be reconstructed. Existing affected users need the existing authenticated password-change or recovery flow once; this change does not silently reset any live account.

Validation: clan/backend/Google deployment/member-ticket/frontend API/i18n regression scripts, TypeScript check and production build. Deployment verified for commit `7880237f8f0614c2d16f6ffbd1d8ac829e6cfec6`: Code checks run 41422171111 passed; Pages run 41422171047 completed its deploy-pages step; Google run 41422171094 completed the actual web-app update step (not skipped), with the log confirming version 20. No live member inventory, password, ticket or clan settings were manually changed. OCR review cursor remains unchanged; this review addresses the interactive login report.
