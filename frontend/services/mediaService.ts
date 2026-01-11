import { useSanity } from "~/composables/useSanity";

export const mediaService = {
  // Fetch media by slug
  async getMediaBySlug(slug: string) {
    const client = useSanity();
    const query = `*[_type == "media" && slug.current == $slug][0]{
      _id,
      title,
      category,
      "imageUrl": image.asset->url,
      "imageDimensions": image.asset->metadata.dimensions,
      altText,
      description,
      "slug": slug.current
    }`;
    return await client.fetch(query, { slug });
  },

  // Fetch media by title
  async getMediaByTitle(title: string) {
    const client = useSanity();
    const query = `*[_type == "media" && title == $title][0]{
      _id,
      title,
      category,
      "imageUrl": image.asset->url,
      "imageDimensions": image.asset->metadata.dimensions,
      altText,
      description,
      "slug": slug.current
    }`;
    return await client.fetch(query, { title });
  },

  // Fetch all media
  async getAllMedia() {
    const client = useSanity();
    const query = `*[_type == "media"]{
      _id,
      title,
      category,
      "imageUrl": image.asset->url,
      "imageDimensions": image.asset->metadata.dimensions,
      altText,
      description,
      "slug": slug.current
    }`;
    return await client.fetch(query);
  },

  // Fetch media by category
  async getMediaByCategory(category: string) {
    const client = useSanity();
    const query = `*[_type == "media" && category == $category]{
      _id,
      title,
      category,
      "imageUrl": image.asset->url,
      "imageDimensions": image.asset->metadata.dimensions,
      altText,
      description,
      "slug": slug.current
    }`;
    return await client.fetch(query, { category });
  },
};
