import { getCookie, getRequestHeaders, getRequestURL } from "h3";

/**
 * Serves rendered pages from Cloudflare's edge cache (the Workers Cache API).
 *
 * Why: on the Workers free plan a request may use 10 ms of CPU, and rendering
 * a Vuetify page takes longer than that, so Cloudflare was cutting requests
 * off. A cache hit costs a fraction of a millisecond, so only the first
 * visitor per Cloudflare location every few minutes pays for a render.
 *
 * Cloudflare runs the Worker *before* its CDN cache, so Cache-Control headers
 * or Cache Rules alone would not stop the render -- the Worker has to look in
 * the cache itself.
 *
 * On a miss the page is rendered through Nitro's `localFetch`, which runs the
 * normal Nuxt renderer in-process and hands back the whole body, streamed or
 * not. The bypass header keeps that inner request from coming back here.
 *
 * Worth knowing:
 * - The cache key includes the build id. A Worker only serves the current
 *   deploy's /_nuxt assets, so HTML cached by the previous deploy would point
 *   at files that no longer exist.
 * - Sanity preview (the `__sanity_preview` cookie) always renders fresh, since
 *   those pages show drafts.
 * - The Cache API does nothing on *.workers.dev, so pages are only cached on
 *   the custom domain.
 * - Published Sanity changes show up within TTL_SECONDS.
 */
const TTL_SECONDS = 300;
const BYPASS_HEADER = "x-page-cache-bypass";
const PREVIEW_COOKIE = "__sanity_preview";

export default defineEventHandler(async (event) => {
  // Only the Workers runtime has caches.default; local dev and Node skip this.
  const cache = (globalThis as any).caches?.default as Cache | undefined;
  if (!cache) return;

  if (event.method !== "GET") return;
  if (getRequestHeader(event, BYPASS_HEADER)) return;
  if (getCookie(event, PREVIEW_COOKIE)) return;

  const url = getRequestURL(event);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_")) return;

  const buildId = useRuntimeConfig(event).app.buildId;
  const key = new Request(
    `${url.origin}/__page-cache/${buildId}${url.pathname}${url.search}`,
  );

  const hit = await cache.match(key);
  if (hit) return withCacheStatus(hit, "HIT");

  // Rendered without cookies, so the cached copy is the same for everyone.
  const headers = new Headers();
  for (const [name, value] of Object.entries(getRequestHeaders(event))) {
    if (value && name !== "cookie") headers.set(name, value);
  }
  headers.set(BYPASS_HEADER, "1");

  const rendered = await useNitroApp().localFetch(url.pathname + url.search, {
    headers,
  });

  const cacheable =
    rendered.status === 200 &&
    rendered.headers.get("content-type")?.includes("text/html") &&
    !rendered.headers.has("set-cookie");
  if (!cacheable) return rendered;

  const body = await rendered.text();
  const stored = new Response(body, rendered);
  stored.headers.set("cache-control", `public, max-age=${TTL_SECONDS}`);
  const put = cache.put(key, stored);
  if (event.waitUntil) event.waitUntil(put);
  else await put;

  return withCacheStatus(new Response(body, rendered), "MISS");
});

// The stored copy carries a max-age for the edge cache only; browsers keep
// revalidating as before, so a published change is never stuck in one.
function withCacheStatus(response: Response, status: "HIT" | "MISS") {
  const out = new Response(response.body, response);
  out.headers.delete("cache-control");
  out.headers.set("x-page-cache", status);
  return out;
}
