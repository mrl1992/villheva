import { createClient } from "@sanity/client";

export const useSanity = () => {
  const config = useRuntimeConfig();
  const previewCookie = useCookie("__sanity_preview");
  const isDraftMode = !!previewCookie.value;

  return createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: false, // Always fetch fresh in development for stega
    perspective: isDraftMode ? "previewDrafts" : "published",
    token: isDraftMode ? previewCookie.value : undefined,
    stega: {
      enabled: true, // Always enable stega so Studio can encode overlays
      studioUrl: "http://localhost:3333",
    },
  });
};
