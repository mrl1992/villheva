import { defineStore } from "pinia";

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  weight?: number;
  category?: string;
  quantity: number;
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  const addToCart = (product: any) => {
    const existingItem = items.value.find(
      (item) => item.id === product._id || item.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({
        id: product._id || product.id,
        title: product.title,
        price: product.price,
        weight: product.weight,
        category: product.category,
        quantity: 1,
      });
    }
  };

  const removeFromCart = (productId: string | number) => {
    items.value = items.value.filter((item) => item.id !== productId);
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    const item = items.value.find((item) => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  const cartCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  const cartTotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };
});
