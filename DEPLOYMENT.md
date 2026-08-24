# Deploying Villheva to Cloudflare

The site is a Nuxt app deployed to **Cloudflare Workers** with server-side
rendering, currently live at `https://villheva.nn76kg9y4d.workers.dev`. Cloudflare runs Nuxt natively, so the Nuxt server routes in
`frontend/server/` work as-is — there is no separate backend to maintain.

**Registrar is domene.no; host is Cloudflare.** The domain stays registered at
domene.no — you are only repointing where it resolves, not transferring it.

## One-time setup

### 1. Connect the repository

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
**Connect to Git** → pick `mrl1992/villheva`.

Build settings:

| Setting                | Value           |
| ---------------------- | --------------- |
| Framework preset       | Nuxt            |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Root directory         | `frontend`      |

Nuxt detects Cloudflare and picks the Nitro preset itself. To reproduce the
same build locally, set `NITRO_PRESET=cloudflare_pages` (the preset name is
historical; it produces the Worker bundle Cloudflare runs either way).

Nuxt detects Cloudflare and selects the right Nitro preset on its own, so
nothing in `nuxt.config.ts` needs to name a preset.

### 2. Environment variables

Settings → **Environment variables**, for both Production and Preview:

| Variable                | Value                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| `SANITY_PROJECT_ID`     | `u8jecufq`                                                       |
| `SANITY_DATASET`        | `product` — **not** `production`, which exists but is empty      |
| `SANITY_API_TOKEN`      | read token from sanity.io/manage                                 |
| `SITE_URL`              | `https://www.villheva.no`                                        |
| `RESEND_API_KEY`        | `re_…` (mark as a **secret**)                                    |
| `RESEND_FROM_EMAIL`     | `noreply@villheva.no`                                            |
| `ADMIN_EMAIL`           | `post@villheva.no`                                               |
| `SANITY_API_READ_TOKEN` | **Viewer** token — required for Presentation preview (see below) |

Set these as **Secrets** (encrypted) rather than plaintext variables, and
redeploy afterwards so the Worker picks them up. Note that `frontend/.env` is
local only — it has no effect on the deployed Worker.

### 3. Domain, DNS and redirects

The domain is registered at **domene.no**, and Cloudflare needs to serve DNS
for it. Two ways, in order of preference:

**A. Move nameservers to Cloudflare (recommended).** Cloudflare then manages
DNS, proxying, caching and the certificate.

1. In Cloudflare: **Add a site** → `villheva.no` → pick the Free plan. It scans
   your current records — check the list carefully, especially the **MX and TXT
   records for email**, since a missing MX record silently breaks incoming mail.
2. Cloudflare gives you two nameservers, e.g. `xxx.ns.cloudflare.com`.
3. In the domene.no Kundeweb: **Mine produkter** → **Domenenavn** →
   **Administrere** next to `villheva.no` → the nameserver / navnetjener
   setting → replace domene.no's nameservers with Cloudflare's two.
4. Propagation is usually under an hour. Cloudflare's dashboard flips the zone
   to **Active** when it sees the change.

Note that moving nameservers moves _all_ DNS for the domain, including any
email records that currently point at domene.no's mail service. Copy those
across first.

**B. Keep DNS at domene.no.** Leave the nameservers alone and add a `CNAME`
for `www` pointing at your `*.pages.dev` hostname, plus a redirect for the
apex. This is more fiddly — the apex cannot be a CNAME at most registrars —
and you lose Cloudflare's proxying and caching. Only worth it if something
else depends on domene.no's DNS.

**Custom domains and the www redirect**

Once DNS is on Cloudflare: Workers & Pages → your project → **Custom domains**
→ add `www.villheva.no` and `villheva.no`.

Every canonical URL the site emits uses `www`, so add a **Redirect Rule**
(Rules → Redirect Rules) sending `villheva.no/*` to
`https://www.villheva.no/$1` with a **301**. Cloudflare issues and renews the
TLS certificate automatically; there is no server config to write.

### 4. Cutover

Keep Vercel live until the Cloudflare deployment is confirmed.

1. Deploy and test on the `*.pages.dev` URL first.
2. Walk the checklist below.
3. Repoint the nameservers at domene.no as described above.
4. Leave Vercel running for a few days as a rollback.
5. Take the Vercel deployment down once you are confident — while both serve
   the same content, they compete as duplicates.
6. Resubmit `https://www.villheva.no/sitemap.xml` in Google Search Console.

**Checklist**

- [ ] pages load and show content with JavaScript disabled
- [ ] `/products` lists products in the HTML source
- [ ] a product page loads directly, not just via in-app navigation
- [ ] `villheva.no/about` redirects to `https://www.villheva.no/about`
- [ ] `/nonexistent` returns a real 404
- [ ] the contact form sends both the admin mail and the confirmation
- [ ] a test order sends both the receipt and the admin notification
- [ ] `/sitemap.xml` and `/robots.txt` load
- [ ] email to your @villheva.no addresses still arrives (MX records survived)

## Sanity Presentation (visual editing)

The Studio's Presentation tool loads the live site in an iframe and lets you
edit in place. Three things have to line up.

**1. Preview URL** — set in `villheva/.env`:

```
SANITY_STUDIO_PREVIEW_URL=https://villheva.nn76kg9y4d.workers.dev
```

`sanity.config.ts` falls back to the same URL and lists it in `allowOrigins`,
so a Studio built without the `.env` still works. When the custom domain goes
live, change both to `https://www.villheva.no`.

**2. A read token.** Presentation opens `/api/draft-mode/enable` with a
one-time `sanity-preview-secret`. Validating that secret means reading a
`sanity.previewUrlSecret` document from the dataset, which needs a token:

- sanity.io/manage → your project → **API** → **Tokens** → **Add API token**
- Name it something like `preview`, permission **Viewer**
- Add it to the Worker's environment as `SANITY_API_READ_TOKEN`

Without it, `/api/draft-mode/enable` returns 500 with "Preview is not
configured on this deployment" and preview will not start.
The token ends up in a browser cookie so client-side draft queries work, so it
must be **Viewer**, never Editor or Deploy.

**3. A CORS origin.** sanity.io/manage → **API** → **CORS origins** → add
`https://villheva.nn76kg9y4d.workers.dev` with **Allow credentials** ticked
(and the custom domain later). Without it the iframe loads but draft content
never arrives.

To check it end to end: open the Studio, go to Presentation, and confirm the
site loads in the iframe and edits appear live. `/api/draft-mode/enable`
returning 401 means the secret was rejected; 500 means the token is missing or
wrong — the Worker log says which.

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

- **Build-time vs runtime environment variables.** A `process.env.FOO` read
  inside `nuxt.config.ts` happens when the bundle is built, so on Cloudflare it
  bakes in whatever the *build* saw — usually an empty string — and the secret
  you set in the dashboard is ignored. Secrets are therefore read at runtime
  inside the server handlers (`server/utils/email.ts`, `draft-mode/enable.ts`),
  which works because workerd populates `process.env` from the Worker's
  bindings. Both the plain name and the `NUXT_`-prefixed runtimeConfig name are
  accepted. If you add a new secret, read it in a handler, not in the config.
- **The Workers runtime is not Node.** Server code cannot use `fs`,
  `child_process` and similar. This is why `server/utils/email.ts` calls the
  Resend REST API with `$fetch` instead of using the `resend` SDK — the SDK
  pulls in `@react-email/render`, which cannot be bundled for Workers.
- **The `product` / `production` dataset trap.** The Sanity content lives in
  the dataset called `product`. There is also a `production` dataset, and it is
  empty. Pointing at it makes every page render its layout with no content and
  produces no error — the queries just return `[]`. If pages look structurally
  right but blank, check `SANITY_DATASET` first.
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

| Path                                    | Purpose                                                 |
| --------------------------------------- | ------------------------------------------------------- |
| `frontend/server/api/`                  | Contact and order endpoints (run as Workers functions). |
| `frontend/server/api/draft-mode/`       | Presentation preview entry points.                      |
| `villheva/sanity.config.ts`             | Studio config, incl. the Presentation preview URL.      |
| `frontend/server/routes/sitemap.xml.ts` | Sitemap, generated per request.                         |
| `frontend/nuxt.config.ts`               | Runtime config, SEO defaults, cascade layer order.      |
