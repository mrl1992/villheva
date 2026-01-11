import { useSanity } from "~/composables/useSanity";

export const sanityService = {
  // Fetch all products
  async getProducts() {
    const client = useSanity();
    const query = `*[_type == "product"]{
      _id,
      title,
      "slug": slug.current,
      "imageUrl": poster.asset->url
    }`;
    return await client.fetch(query);
  },
};
