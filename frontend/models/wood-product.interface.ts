export interface WoodProduct {
  _id: string;
  title: string;
  slug: string;
  imageUrls?: string[];
  price: number;
  description?: string;
  inStock?: boolean;
  bestSeller?: boolean;
}
