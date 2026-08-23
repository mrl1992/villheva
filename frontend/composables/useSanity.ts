import { createClient } from "@sanity/client";

export const useSanity = () => {
  const config = useRuntimeConfig();
  let isDraftMode = false;
  let token: string | undefined = undefined;

  // Safely read cookie - may fail in sandboxed iframes
  try {
    const previewCookie = useCookie("__sanity_preview");
    isDraftMode = !!previewCookie.value;
    token = previewCookie.value ?? undefined;
  } catch (e) {
    // Cookie access failed (likely sandboxed iframe)
    isDraftMode = false;
    token = undefined;
  }

  const isDev = process.dev;
  const isInIframe =
    typeof window !== "undefined" && window.self !== window.top;

  // Where the Studio lives, for stega click-to-edit links. Note that
  // villheva.sanity.studio is only a redirect -- the Studio is actually served
  // from sanity.io, so that is the origin the Presentation iframe runs on.
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  const studioUrl = isLocalhost
    ? "http://localhost:3333"
    : config.public.sanityStudioUrl;

  return createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: false,
    perspective: isDraftMode ? "drafts" : "published",
    token: token,
    stega: {
      enabled: isDev || isDraftMode || isInIframe,
      studioUrl: studioUrl,
    },
  });
};
