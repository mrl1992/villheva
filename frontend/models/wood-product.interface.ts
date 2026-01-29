export interface WoodProduct {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  price: number;
  description?: string;
  inStock?: boolean;
  bestSeller?: boolean;
}
