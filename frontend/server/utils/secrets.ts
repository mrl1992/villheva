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

/**
 * Diagnostic for the server logs only -- never put this in an HTTP response.
 *
 * Reports, per name, which of the three sources had a value, plus the key names
 * the Worker binding actually exposes. That distinguishes "the variable is not
 * set at all" from "it is set under a different name" or "bindings are not
 * reaching Nitro", which is otherwise guesswork from outside.
 */
export function describeSecretSources(names: string[], event?: H3Event): string {
  const bindingEnv = (event?.context as Record<string, any> | undefined)
    ?.cloudflare?.env as Record<string, unknown> | undefined;
  const config = useRuntimeConfig(event) as Record<string, unknown>;

  const perName = names
    .map((n) => {
      const b = bindingEnv?.[n] ? "yes" : "no";
      const p = process.env[n] ? "yes" : "no";
      return `${n}(binding=${b} process=${p})`;
    })
    .join(" ");

  const bindingKeys = bindingEnv
    ? Object.keys(bindingEnv).sort().join(",") || "(empty)"
    : "(no cloudflare binding on event.context)";

  const configKeys = Object.keys(config)
    .filter((k) => k !== "public")
    .map((k) => `${k}=${config[k] ? "set" : "empty"}`)
    .join(" ");

  return `${perName} | binding keys: ${bindingKeys} | runtimeConfig: ${configKeys}`;
}
