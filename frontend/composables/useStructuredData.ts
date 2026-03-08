export const useStructuredData = (schema: any) => {
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema),
      },
    ],
  });

  return schema;
};

export const createProductSchema = (product: any, siteUrl: string) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.imageUrls?.[0],
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "NOK",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    url: `${siteUrl}/products/${product.slug}`,
  };
};

export const createOrganizationSchema = (site: any, siteUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site?.name || "Villheva",
    description: site?.description,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "NO",
    },
    sameAs: site?.socialLinks || [],
  };
};

export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
  siteUrl: string,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};
