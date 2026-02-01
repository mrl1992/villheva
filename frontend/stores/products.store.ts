import { defineStore } from "pinia";
import type { BakingProduct } from "~/models/baking-product.interface";
import type { WoodProduct } from "~/models/wood-product.interface";
import { sanityService } from "~/services/sanityService";

type Product = BakingProduct | WoodProduct;

export const useProductsStore = defineStore("products", () => {
  const bakingProducts = ref<BakingProduct[]>([]);
  const woodProducts = ref<WoodProduct[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBakingProducts() {
    loading.value = true;
    error.value = null;
    try {
      bakingProducts.value = await sanityService.getBakingProducts();
      console.log("🚀 ~ bakingProducts.value:", bakingProducts.value);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchWoodProducts() {
    loading.value = true;
    error.value = null;
    try {
      woodProducts.value = await sanityService.getWoodProducts();
      console.log("🚀 ~ woodProducts.value:", woodProducts.value);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllProducts() {
    loading.value = true;
    error.value = null;
    try {
      const [baking, wood] = await Promise.all([
        sanityService.getBakingProducts(),
        sanityService.getWoodProducts(),
      ]);
      bakingProducts.value = baking;
      woodProducts.value = wood;
      console.log("🚀 ~ bakingProducts:", bakingProducts.value);
      console.log("🚀 ~ woodProducts:", woodProducts.value);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // Filter products by price range
  function filterByPrice(minPrice: number, maxPrice: number): Product[] {
    const all = [...bakingProducts.value, ...woodProducts.value];
    return all.filter((p) => p.price >= minPrice && p.price <= maxPrice);
  }

  // Filter products by search query
  function searchProducts(query: string): Product[] {
    const all = [...bakingProducts.value, ...woodProducts.value];
    const lowerQuery = query.toLowerCase();
    return all.filter((p) => p.title.toLowerCase().includes(lowerQuery));
  }

  // Filter baking products by allergen (exclude products with allergen)
  function filterByAllergenFree(allergenIds: string[]): BakingProduct[] {
    if (allergenIds.length === 0) return bakingProducts.value;
    return bakingProducts.value.filter(
      (p) =>
        !p.allergens?.some((allergen) => allergenIds.includes(allergen._id)),
    );
  }

  // Get only in-stock products
  function getInStockProducts(products: Product[]): Product[] {
    return products.filter((p) => p.inStock !== false);
  }

  // Get best sellers
  function getBestSellers(): Product[] {
    const all = [...bakingProducts.value, ...woodProducts.value];
    return all.filter((p) => p.bestSeller).sort((a, b) => b.price - a.price);
  }

  // Get all unique allergens from baking products
  function getAllAllergens() {
    const allergenMap = new Map<string, string>();
    bakingProducts.value.forEach((product) => {
      product.allergens?.forEach((allergen) => {
        allergenMap.set(allergen._id, allergen.title);
      });
    });
    return Array.from(allergenMap.entries()).map(([id, title]) => ({
      _id: id,
      title,
    }));
  }

  return {
    bakingProducts,
    woodProducts,
    loading,
    error,
    fetchBakingProducts,
    fetchWoodProducts,
    fetchAllProducts,
    filterByPrice,
    searchProducts,
    filterByAllergenFree,
    getInStockProducts,
    getBestSellers,
    getAllAllergens,
  };
});
