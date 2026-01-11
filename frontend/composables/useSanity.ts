import { createClient } from "@sanity/client";

export const useSanity = () => {
  const config = useRuntimeConfig();

  return createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: false, // disabled for fresh data during development
  });
};
