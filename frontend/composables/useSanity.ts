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
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;

  // Determine the studio URL based on environment
  let studioUrl = "http://localhost:3333";
  if (typeof window !== "undefined") {
    // In browser, use the current origin
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocalhost) {
      studioUrl = "http://localhost:3333";
    } else {
      token;
      // For production/deployed environments
      studioUrl = "https://villheva.sanity.studio";
    }
  }

  return createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: false,
    perspective: isDraftMode ? "previewDrafts" : "published",
    token: token,
    stega: {
      enabled: isDev || isDraftMode || isInIframe,
      studioUrl: studioUrl,
    },
  });
};
