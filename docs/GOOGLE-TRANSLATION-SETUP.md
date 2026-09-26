# Google Cloud Translation activation

The backend integration uses the official Cloud Translation Basic v2 NMT API. Never put credentials in VITE variables, frontend code, version control, or chat.

1. In your Google Cloud project, enable billing and the Cloud Translation API.
2. Create a credential restricted to the Cloud Translation API and, if possible, the VPS outbound IP.
3. Set `GOOGLE_TRANSLATION_API_KEY` in `/var/www/doorhome/.env` privately. Restrict that file to the server owner. Set project quotas to cap translation spending; billing alerts alone are not spending caps.
4. Deploy the updated server with its Google translation endpoint. Keep the key server-side. Translation requests require an authenticated administrator.
5. Run the backfill from `/var/www/doorhome` after installing `server/cloudTranslation.cjs` and `scripts/backfill-content-translations.cjs`. Inspect its result and audit language coverage before claiming all content is ready. The current backfill handles products, gallery and division record titles/descriptions; nested models, custom section text and interface dictionaries require a separate completeness pass.

Existing text/manual translations are preserved. Machine translations need terminology review. The persistent cache can be copied when migrating the VPS so unchanged content is not translated and charged again.

The navbar styling is independent and can be deployed before credentials are ready. Do not replace the current production backend wholesale with an older local build: deploy the translation changes selectively to preserve newer authentication and CMS behavior.

Reference: https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate
