import { createClient } from "@sanity/client";

export const useSanity = () => {
  const config = useRuntimeConfig();
  const previewCookie = useCookie("__sanity_preview");
  const isDraftMode = !!previewCookie.value;
  const isDev = process.dev;

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
    token: isDraftMode ? (previewCookie.value ?? undefined) : undefined,
    stega: {
      enabled: isDev || isDraftMode,
      studioUrl: studioUrl,
    },
  });
};
