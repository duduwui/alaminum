# Doorhome search visibility and VPS migration

## After deploying these changes

- Keep the public domain `https://doorhome.company` and the same page URLs.
- Verify `/favicon.ico`, `/icon-192.png`, `/icon-512.png`, `/apple-touch-icon.png`, `/robots.txt` and `/sitemap.xml` return HTTP 200 with the correct content type, not the app HTML.
- Submit `https://doorhome.company/sitemap.xml` in Google Search Console.
- Inspect the homepage, `/products`, `/projects` and `/contact` in Search Console. Run the live test, then request indexing. The logo and search snippets change only after Google processes them; neither appearance nor rankings are guaranteed.
- Use accurate product names and detailed descriptions in admin. Describe materials, use cases and actual features naturally. Do not add repeated keywords, misspellings, invented locations or unsupported claims.

## Moving to another VPS without changing the domain

1. Back up the database (PostgreSQL, if enabled), all existing `*_db.json` files, the entire `uploads/` folder, project/public assets and the server environment configuration. Keep backups private: users and sessions contain sensitive account information.
2. Copy the same application and persistent data to the new VPS. Copy environment values securely, including database credentials, `PUBLIC_APP_URL`, email delivery configuration and other keys. Do not commit secrets.
3. Configure HTTPS for `doorhome.company`, the same hostname redirects and the same URL paths. Keep the sitemap, canonical URLs and icon URLs on the public domain—not the temporary IP address.
4. Test the new host before switching DNS: homepage, catalog, media, projects, contact submission, admin login, uploads, cart requests and SEO metadata. Do not expose an indexable duplicate of the production site on a staging domain.
5. Stop writes briefly for the final data sync so requests, users and uploads are not lost. Update the domain DNS A/AAAA records to the new VPS; verify both IPv4 and IPv6 configuration.
6. Keep the old VPS online while DNS caches expire and confirm traffic, media and Googlebot reach the new host. Monitor errors and Search Console before retiring it.

Changing only the VPS does not create a new website identity. Downtime, missing files, blocked crawlers, changed URLs or broken HTTPS can still affect crawling and search performance temporarily.

If the domain or public URLs change, use a separate migration plan with permanent redirects. Do not simply abandon the old domain.

References:
- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

## Live deployment — 2026-09-26

Applied the favicon assets, manifest, robots rules and updated HTML metadata to the current VPS. Preserved the existing live JavaScript/CSS bundles because production differs from the local build. Patched only the production server's HTML routing to supply page-specific metadata and return 404 for missing assets; retained its existing authentication and application handlers.

Rollback files are stored privately on the VPS at `/var/backups/doorhome-seo-OStpEF`. Application data, uploads, environment configuration and accounts were not replaced. Before a future full deployment, reconcile production-only changes with the local source rather than overwriting them with an older build.
