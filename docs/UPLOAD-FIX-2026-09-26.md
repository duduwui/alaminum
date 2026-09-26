# Upload and project batch changes

- Removed client-only administrator login fallback: a successful server login is required for media uploads and CMS writes.
- Admin dashboard validates its server session before rendering editors; missing/expired sessions show sign-in.
- Session lookup selects an unexpired token from bearer/header/cookies so stale browser tokens do not hide a valid cookie.
- Project upload accepts multiple image/video files, creates one editable card per successful file and reports partial failures.
- Removed static title/category labels above the five showcase card editors.

Build succeeds. Type checking still reports the existing request-status/subtotal and translation-language errors outside this change.

Production was updated selectively, preserving its existing client code and backend handlers. The active client entry is `/assets/index-upload-fix.js`; the existing CSS bundle remains unchanged. Server and HTML rollback copies are in `/var/backups/doorhome-upload-20260926` on the VPS. CMS files, user records, requests and uploads were not replaced.

Validation: mixed image/video batch handler test (including partial failure) and valid-cookie/expired-bearer session test passed. The server had no active administrator sessions during verification, so an authenticated live upload could not be tested without signing in. Administrators must refresh and sign in again; no sessions were extended or fabricated.
