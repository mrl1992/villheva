# Deploying Villheva to domene.no

The site is a Nuxt app that is **prerendered to static HTML** (`nuxt generate`)
and served by Apache. domene.no has PHP 8 but no Node runtime, so the two form
endpoints that used to be Nuxt server routes are now PHP.

Everything below the `## One-time setup` heading only needs doing once.

---

## How a deploy works

`.github/workflows/deploy.yml` runs on:

- a push to `main`
- a `sanity-publish` repository dispatch (so publishing content rebuilds the site)
- a manual **Run workflow** click

It installs dependencies, runs `npm run generate`, asserts the output actually
contains content, and uploads `frontend/.output/public/` over FTPS.

To build and inspect locally:

```bash
cd frontend
npm run generate          # output lands in .output/public/
npx serve .output/public  # rough preview; does not apply .htaccess rules
```

---

## One-time setup

### 1. GitHub repository secrets

**Settings → Secrets and variables → Actions**

| Secret | Value |
| --- | --- |
| `SANITY_PROJECT_ID` | `u8jecufq` |
| `SANITY_DATASET` | `product` |
| `SANITY_API_TOKEN` | a **read** token from sanity.io/manage |
| `FTP_SERVER` | the FTP host from domene.no |
| `FTP_USERNAME` | FTP user |
| `FTP_PASSWORD` | FTP password |
| `FTP_SERVER_DIR` | web root, usually `./public_html/` — **must end in a slash** |

### 2. Server-side secrets for the PHP endpoints

The Resend API key must never be in the repo. After the first deploy, over
FTP or the cPanel file manager:

```bash
cd public_html/api/lib
cp config.example.php config.php
# then edit config.php and fill in:
#   RESEND_API_KEY     re_...
#   RESEND_FROM_EMAIL  noreply@villheva.no
#   ADMIN_EMAIL        post@villheva.no
```

`config.php` is git-ignored, excluded from the FTP sync, and blocked from the
web by the `.htaccess`. Deploys will not overwrite or delete it.

Verify it is unreachable — this must return 404:

```bash
curl -o /dev/null -w '%{http_code}\n' https://www.villheva.no/api/lib/config.php
```

### 3. Rebuild when content is published

In **sanity.io/manage → API → Webhooks**, add:

- URL `https://api.github.com/repos/mrl1992/villheva/dispatches`
- Method `POST`
- HTTP header `Authorization: Bearer <GitHub PAT with 'repo' scope>`
- HTTP header `Accept: application/vnd.github+json`
- Body `{"event_type": "sanity-publish"}`
- Trigger on create / update / delete

Without this, Sanity edits will not appear until the next push to `main`.

### 4. DNS cutover — do this last

Keep the Vercel deployment live until the new host is confirmed good.

1. Deploy to domene.no and test against the host directly (a `hosts` file
   entry pointing `www.villheva.no` at the domene.no IP is the cleanest way).
2. Walk the checklist below.
3. Only then point the `A` / `CNAME` records for `villheva.no` and
   `www.villheva.no` at domene.no, and enable their free SSL certificate.
4. Leave Vercel running for a few days as a rollback.
5. After the cutover, resubmit `https://www.villheva.no/sitemap.xml` in Google
   Search Console.

**Post-cutover checklist**

- [ ] `https://www.villheva.no/` loads and shows content with JavaScript disabled
- [ ] `/products` lists products in the HTML source
- [ ] a product page loads directly, not just via in-app navigation
- [ ] `http://villheva.no/about` 301s to `https://www.villheva.no/about`
- [ ] `/nonexistent` returns a real 404
- [ ] the contact form sends both the admin mail and the confirmation
- [ ] a test order sends both the receipt and the admin notification
- [ ] `/api/lib/config.php` returns 404
- [ ] `/sitemap.xml` and `/robots.txt` load

---

## Known consequences of going static

- **Sanity draft mode / visual editing no longer works in production.** There is
  no server to toggle the preview cookie. Use `npm run dev` locally for it. The
  `server/` directory is kept so dev and any future SSR deploy still work.
- **Content is only as fresh as the last build.** That is what the Sanity
  webhook in step 3 is for.
- **No CDN.** Everything is served from one Norwegian server, which is why the
  `.htaccess` sets long cache lifetimes and gzip, and why the images in
  `frontend/public/` were reduced from 11 MB to 88 KB.

## Where things live

| Path | Purpose |
| --- | --- |
| `frontend/public/.htaccess` | Apache config — routing, canonical redirects, caching. Edit here, never on the server. |
| `frontend/public/api/*.php` | The contact and order endpoints. |
| `frontend/public/api/lib/` | Shared PHP + credentials. Blocked from the web. |
| `frontend/server/` | Nuxt server routes. Used by `npm run dev` and the sitemap prerender; not deployed as code. |
| `.github/workflows/deploy.yml` | Build and FTPS upload. |
