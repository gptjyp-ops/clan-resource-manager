# POTATO administrator recovery — 2026-11-12

The Apps Script settings UI reports more than 50 properties and displays only the first 50 read-only. No property values were inspected for this diagnosis.

A new owner-initiated flow avoids changing or removing unrelated properties. In the Apps Script editor, the owner explicitly runs `preparePotatoAdminRecovery`. It verifies the existing operator identity and the fixed POTATO registry ID/name, then logs the existing web app recovery-page URL and a private 256-bit one-use code. The code is stored only as an HMAC, expires after 10 minutes, replaces any preceding code, and is bound to the current administrator salt. Issuing the code does not change the password.

The user opens that page, enters the code and a new password twice, and submits personally. No password is placed in source, URLs, logs or Script Properties. The server validates the code under a script lock, rejects expired/stale/incorrect-clan codes, consumes it before mutation, updates only the administrator password hash/salt and lockout fields, and revokes old administrator sessions and the administrator QR binding. Personal member tickets, member records, quantities, photos and clan settings remain unchanged. A partial storage failure requires another owner-issued code.

Tests: existing backend/deployment suites plus owner denial, hashed-code storage, issue-without-password-change, incorrect code, password validation, replacement, expiry, stale administrator salt, wrong clan, replay prevention, session/QR revocation and member preservation.

Deployment verified for commit `0a5e641c62b018473e340d003eb030c4b5328637`: Code checks run 43208415524, Pages run 43208415347, and Google run 43208415357 all succeeded. The Google job explicitly completed `Update existing Google web app` successfully. Reloading the live Apps Script editor displayed and selected `preparePotatoAdminRecovery`. No production code has been issued or password reset performed by the assistant. Credential entry and final submission are reserved for the user.
