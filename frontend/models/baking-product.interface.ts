export interface Allergen {
  _id: string;
  title: string;
}

export interface BakingProduct {
  _id: string;
  title: string;
  slug: string;
  imageUrls?: string[];
  price: number;
  weight: number;
  description?: string;
  allergens: Allergen[];
  inStock?: boolean;
  bestSeller?: boolean;
}
