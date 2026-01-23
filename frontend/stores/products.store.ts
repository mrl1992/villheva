import { defineStore } from "pinia";
import type { BakingProduct } from "~/models/baking-product.interface";
import type { WoodProduct } from "~/models/wood-product.interface";
import { sanityService } from "~/services/sanityService";

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

  return {
    bakingProducts,
    woodProducts,
    loading,
    error,
    fetchBakingProducts,
    fetchWoodProducts,
    fetchAllProducts,
  };
});
