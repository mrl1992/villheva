import { computed } from "vue";

interface SeoMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const useSeo = (meta: SeoMeta = {}) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const siteUrl = config.public.siteUrl;
  const siteName = config.public.siteName;

  const currentUrl = computed(() => {
    return `${siteUrl}${route.fullPath}`;
  });

  const canonical = computed(() => {
    return meta.url || currentUrl.value;
  });

  const title = computed(() => {
    const pageTitle = meta.title || "Villheva";
    return pageTitle.includes(siteName)
      ? pageTitle
      : `${pageTitle} | ${siteName}`;
  });

  const description = computed(() => {
    return (
      meta.description || "Villheva - Fersk surdeigbrød og håndlagde bakevarer"
    );
  });

  const imageUrl = computed(() => {
    return meta.image || `${siteUrl}/og-image.png`;
  });

  useHead({
    title: title,
    meta: [
      {
        name: "description",
        content: description,
      },
      {
        name: "og:title",
        content: title,
      },
      {
        name: "og:description",
        content: description,
      },
      {
        name: "og:image",
        content: imageUrl,
      },
      {
        name: "og:url",
        content: currentUrl,
      },
      {
        name: "og:type",
        content: meta.type || "website",
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: description,
      },
      {
        name: "twitter:image",
        content: imageUrl,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: canonical,
      },
    ],
  });

  return {
    title,
    description,
    imageUrl,
    currentUrl,
    canonical,
  };
};
