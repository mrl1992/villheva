import { createClient } from "@sanity/client";

export const useSanity = () => {
  const config = useRuntimeConfig();
  const previewCookie = useCookie("__sanity_preview");
  const isDraftMode = !!previewCookie.value;
  const isDev = process.dev;

  return createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: false,
    perspective: isDraftMode ? "previewDrafts" : "published",
    token: isDraftMode ? (previewCookie.value ?? undefined) : undefined,
    stega: {
      enabled: isDev || isDraftMode,
      studioUrl: "http://localhost:3333",
    },
  });
};
