import { defineStore } from "pinia";
import type { Product } from "~/models/product.interface";
import { sanityService } from "~/services/sanityService";

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProducts() {
    loading.value = true;
    error.value = null;
    try {
      products.value = await sanityService.getProducts();
      console.log("🚀 ~ products.value:", products.value);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    products,
    fetchProducts,
  };
});
