export interface Allergen {
  _id: string;
  title: string;
}

export interface BakingProduct {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  price: number;
  weight: number;
  allergens: Allergen[];
  inStock?: boolean;
  bestSeller?: boolean;
}
