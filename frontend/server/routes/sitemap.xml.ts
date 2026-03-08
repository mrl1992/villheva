import { sanityService } from "~/services/sanityService";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl;

  try {
    // Fetch all products for dynamic URLs
    const bakingProducts = await sanityService.getBakingProducts();
    const woodProducts = await sanityService.getWoodProducts();

    // Static pages
    const staticPages = [
      { url: "", changefreq: "weekly", priority: 1.0 },
      { url: "/products", changefreq: "weekly", priority: 0.8 },
      { url: "/about", changefreq: "monthly", priority: 0.7 },
      { url: "/gallery", changefreq: "monthly", priority: 0.6 },
      { url: "/cart", changefreq: "weekly", priority: 0.5 },
      { url: "/checkout", changefreq: "weekly", priority: 0.5 },
    ];

    // Product pages
    const productPages = [
      ...bakingProducts.map((product: any) => ({
        url: `/products/${product.slug}`,
        changefreq: "monthly",
        priority: 0.7,
      })),
      ...woodProducts.map((product: any) => ({
        url: `/products/${product.slug}`,
        changefreq: "monthly",
        priority: 0.7,
      })),
    ];

    const allPages = [...staticPages, ...productPages];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page: any) => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`,
  )
  .join("")}
</urlset>`;

    setHeader(event, "Content-Type", "application/xml");
    return xml;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error generating sitemap",
    });
  }
});
