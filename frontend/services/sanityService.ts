import { useSanity } from "~/composables/useSanity";
import type { BakingProduct } from "~/models/baking-product.interface";
import type { WoodProduct } from "~/models/wood-product.interface";

export const sanityService = {
  // Fetch all products
  async getProducts() {
    const client = useSanity();
    const query = `*[_type == "product"]{
      _id,
      title,
      "slug": slug.current,
      "imageUrl": poster.asset->url,
      price,
      weight,
      "allergens": allergens[]->{_id, title},
      "category": category->{_id, title}
    }`;
    return await client.fetch(query);
  },

  // Fetch all baking products
  async getBakingProducts(): Promise<BakingProduct[]> {
    const client = useSanity();
    const query = `*[_type == "baking-products"]{
      _id,
      title,
      "slug": slug.current,
      "imageUrl": poster.asset->url,
      price,
      weight,
      "allergens": allergens[]->{_id, title}
    }`;
    return await client.fetch(query);
  },

  // Fetch all wood products
  async getWoodProducts(): Promise<WoodProduct[]> {
    const client = useSanity();
    const query = `*[_type == "wood-products"]{
      _id,
      title,
      "slug": slug.current,
      "imageUrl": poster.asset->url,
      price,
      description
    }`;
    return await client.fetch(query);
  },

  // Fetch a single product by slug (handles both baking and wood products)
  async getProductBySlug(
    slug: string,
  ): Promise<BakingProduct | WoodProduct | null> {
    const client = useSanity();
    const query = `*[_type in ["baking-products", "wood-products"] && slug.current == $slug][0]{
      _id,
      _type,
      title,
      "slug": slug.current,
      "imageUrl": poster.asset->url,
      price,
      weight,
      description,
      "allergens": allergens[]->{_id, title}
    }`;
    return await client.fetch(query, { slug });
  },

  async getSiteSettings() {
    const client = useSanity();
    const query = `*[_type == "site-settings"][0]{
    heroTitle,
    heroSubtitle,
    heroCtaLabel,
    heroCtaHref,
    "heroImageUrl": heroImage.asset->url
  }`;
    return client.fetch(query);
  },
};
