import type { H3Event } from "h3";

/**
 * Reads a secret on any runtime, trying the most direct source first.
 *
 * Why three sources:
 *
 * 1. `event.context.cloudflare.env` — the Worker's bindings straight off the
 *    request. No shim, no compatibility flag, nothing to misconfigure. Nitro's
 *    Cloudflare preset puts them there in production too (it passes them as
 *    `_platform`, which `nitropack`'s app.mjs spreads onto `event.context`).
 * 2. `process.env` — on Workers this is unenv's shim, whose `_getEnv()` reads
 *    `globalThis.__env__`; the Cloudflare preset assigns that per request. It
 *    therefore works *without* `nodejs_compat`. On Node it is the real thing.
 * 3. `runtimeConfig` — picks up `NUXT_`-prefixed overrides.
 *
 * Note this is deliberately read at request time. The same lookup in
 * `nuxt.config.ts` would run at build time and bake in whatever the build
 * machine had, which on Cloudflare means an empty string.
 */
export function readSecret(
  envName: string,
  configKey: string,
  event?: H3Event,
): string | undefined {
  const fromBinding = (event?.context as Record<string, any> | undefined)
    ?.cloudflare?.env?.[envName];
  if (fromBinding) return fromBinding;

  const fromProcess = process.env[envName];
  if (fromProcess) return fromProcess;

  const fromConfig = (useRuntimeConfig(event) as Record<string, any>)[configKey];
  return fromConfig || undefined;
}
