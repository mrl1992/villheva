import { useSanity } from "~/composables/useSanity";
import type { BakingProduct } from "~/models/baking-product.interface";
import type { WoodProduct } from "~/models/wood-product.interface";
import type { Employee } from "~/models/employee.interface";

export const sanityService = {
  // Fetch all products
  async getProducts() {
    const client = useSanity();
    const query = `*[_type == "product"]{
      _id,
      title,
      "slug": slug.current,
      "imageUrls": images[]->image.asset->url,
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
      "imageUrls": images[]->image.asset->url,
      price,
      weight,
      description,
      "allergens": allergens[]->{_id, title},
      bestSeller,
      inStock
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
      "imageUrls": images[]->image.asset->url,
      price,
      description,
      bestSeller,
      inStock
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
      "imageUrls": images[]->image.asset->url,
      price,
      weight,
      description,
      "allergens": allergens[]->{_id, title},
      bestSeller,
      inStock
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
    "heroImageUrl": heroImage->image.asset->url,
  aboutUsTitle,
  aboutUsText1,
  aboutUsText2,
  aboutUsText3,
  "aboutUsImageUrl": aboutUsImage->image.asset->url,
  "frontpageAboutSectionPictureUrl": frontpageAboutSectionPicture->image.asset->url,
  ourStory,
  "process": process->{
    title,
    subtitle,
    description,
    steps[]{
      title,
      description
    },
    finalRemark
  }
  }`;
    return client.fetch(query);
  },

  // Fetch all active employees
  async getEmployees(): Promise<Employee[]> {
    const client = useSanity();
    const query = `*[_type == "employees" && isActive == true] | order(order asc){
      _id,
      name,
      "slug": slug.current,
      title,
      bio,
      email,
      phone,
      "imageUrl": image->image.asset->url,
      order,
      isActive
    }`;
    return await client.fetch(query);
  },
};
