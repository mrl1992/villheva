# Deploying Villheva to Cloudflare

The site is a Nuxt app deployed to **Cloudflare Pages** with server-side
rendering. Cloudflare runs Nuxt natively, so the Nuxt server routes in
`frontend/server/` work as-is — there is no separate backend to maintain.

## One-time setup

### 1. Connect the repository

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
**Connect to Git** → pick `mrl1992/villheva`.

Build settings:

| Setting | Value |
| --- | --- |
| Framework preset | Nuxt |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `frontend` |

Nuxt detects Cloudflare and selects the right Nitro preset on its own, so
nothing in `nuxt.config.ts` needs to name a preset.

### 2. Environment variables

Settings → **Environment variables**, for both Production and Preview:

| Variable | Value |
| --- | --- |
| `SANITY_PROJECT_ID` | `u8jecufq` |
| `SANITY_DATASET` | `product` |
| `SANITY_API_TOKEN` | read token from sanity.io/manage |
| `SITE_URL` | `https://www.villheva.no` |
| `RESEND_API_KEY` | `re_…` (mark as a **secret**) |
| `RESEND_FROM_EMAIL` | `noreply@villheva.no` |
| `ADMIN_EMAIL` | `post@villheva.no` |

### 3. Domain and redirects

Custom domains → add `www.villheva.no` and `villheva.no`.

Every canonical URL the site emits uses `www`, so add a bulk redirect (or a
redirect rule) sending `villheva.no/*` to `https://www.villheva.no/$1` with a
301. Cloudflare handles HTTPS and the certificate; there is no server config
to write.

### 4. DNS cutover

Keep Vercel live until the Cloudflare deployment is confirmed.

1. Deploy and test on the `*.pages.dev` URL first.
2. Walk the checklist below.
3. Point the `villheva.no` nameservers (or the A/CNAME records) at Cloudflare.
4. Leave Vercel running for a few days as a rollback.
5. Resubmit `https://www.villheva.no/sitemap.xml` in Google Search Console.

**Checklist**

- [ ] pages load and show content with JavaScript disabled
- [ ] `/products` lists products in the HTML source
- [ ] a product page loads directly, not just via in-app navigation
- [ ] `villheva.no/about` redirects to `https://www.villheva.no/about`
- [ ] `/nonexistent` returns a real 404
- [ ] the contact form sends both the admin mail and the confirmation
- [ ] a test order sends both the receipt and the admin notification
- [ ] `/sitemap.xml` and `/robots.txt` load

## How deploys work

Push to `main` → Cloudflare builds and deploys. Pull requests get their own
preview URL. There is no GitHub Actions workflow and no FTP step.

Because the site is server-rendered, **content is always live**: publishing in
Sanity shows up on the next request with no rebuild. The `repository_dispatch`
webhook that a static build would have needed is not required — you can delete
it from sanity.io/manage → API → Webhooks if you set one up.

To build locally the way Cloudflare does:

```bash
cd frontend
NITRO_PRESET=cloudflare_pages npm run build
npx wrangler pages dev dist        # runs the real Workers runtime
```

Plain `npm run build` produces a Node server (`node .output/server/index.mjs`),
which is fine for local checks but is not what Cloudflare runs.

## Things worth knowing

- **The Workers runtime is not Node.** Server code cannot use `fs`,
  `child_process` and similar. This is why `server/utils/email.ts` calls the
  Resend REST API with `$fetch` instead of using the `resend` SDK — the SDK
  pulls in `@react-email/render`, which cannot be bundled for Workers.
- **`SANITY_API_TOKEN` is currently exposed** via `runtimeConfig.public` in
  `nuxt.config.ts`, which inlines it into the client bundle. Now that the app
  is server-rendered it no longer needs to be public; worth moving out of
  `public` and reading it server-side only.
- **Vuetify 4 cascade layers.** The layer order is declared as an inline
  `<style>` in `nuxt.config.ts`, because the CSS minifier strips bare
  `@layer a, b, c;` statements and the browser fixes layer priority from the
  first occurrence it sees. Unlayered CSS beats every Vuetify rule regardless
  of specificity, so the reset in `global.scss` lives in `@layer app-reset`
  (below Vuetify's components) and deliberate branding in `@layer app` (above
  them). Put new global rules in the right one.
- `plugins/vuetify.ts` and `global.scss` carry explicit restorations of v3
  behaviour that Vuetify 4 changed — light default theme, v3 breakpoints,
  uppercase buttons, MD2 button letter-spacing, v3 container max-widths. Each
  is commented with why.

## Where things live

| Path | Purpose |
| --- | --- |
| `frontend/server/api/` | Contact and order endpoints (run as Workers functions). |
| `frontend/server/routes/sitemap.xml.ts` | Sitemap, generated per request. |
| `frontend/nuxt.config.ts` | Runtime config, SEO defaults, cascade layer order. |
