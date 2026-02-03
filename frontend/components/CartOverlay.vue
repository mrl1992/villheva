<template>
  <v-dialog v-model="isOpen" max-width="600px" class="cart-overlay">
    <v-card>
      <v-card-title class="cart-title-header">
        <span>Handlekurv</span>
        <v-btn icon small @click="isOpen = false" class="ml-auto">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="cart-content">
        <div v-if="cartStore.items.length === 0" class="empty-cart">
          <p>Kurven er tom</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-info">
              <h3 class="item-title">{{ item.title }}</h3>
              <p v-if="item.weight" class="item-weight">{{ item.weight }}g</p>
              <p class="item-price">{{ item.price }} kr</p>
            </div>

            <div class="item-controls">
              <button
                class="qty-btn"
                @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
              >
                -
              </button>
              <span class="qty-display">{{ item.quantity }}</span>
              <button
                class="qty-btn"
                @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
              >
                +
              </button>
              <button
                class="remove-btn"
                @click="cartStore.removeFromCart(item.id)"
              >
                ✕
              </button>
            </div>

            <div class="item-total">{{ item.price * item.quantity }} kr</div>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions v-if="cartStore.items.length > 0" class="cart-actions">
        <div class="summary-row">
          <span class="total-label">Totalt:</span>
          <span class="total-price">{{ cartStore.cartTotal }} kr</span>
        </div>
        <v-btn
          color="primary"
          block
          class="checkout-btn"
          @click="
            navigateTo('/checkout');
            isOpen = false;
          "
        >
          Gå til betaling
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  const cartStore = useCartStore();
  const isOpen = ref(false);

  // Expose openCart method to parent
  defineExpose({
    openCart: () => {
      isOpen.value = true;
    },
  });
</script>

<style scoped>
  .cart-overlay {
    z-index: 1001;
  }

  .cart-title-header {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    font-family: "Playfair Display", serif;
    font-size: 1.5rem;
    color: #4d4738;
  }

  .cart-content {
    max-height: 60vh;
    overflow-y: auto;
  }

  .empty-cart {
    text-align: center;
    padding: 2rem 1rem;
    color: #999;
  }

  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 0.5rem;
  }

  .item-info {
    flex: 1;
  }

  .item-title {
    font-weight: 600;
    color: #4d4738;
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
  }

  .item-weight {
    font-size: 0.85rem;
    color: #999;
    margin: 0.125rem 0;
  }

  .item-price {
    font-weight: 500;
    color: #755f4a;
    margin: 0.25rem 0 0 0;
    font-size: 0.9rem;
  }

  .item-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .qty-btn {
    width: 28px;
    height: 28px;
    border: 1px solid #c0ae94;
    background: white;
    color: #4d4738;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: background-color 0.2s;
  }

  .qty-btn:hover {
    background-color: #c0ae94;
  }

  .qty-display {
    min-width: 24px;
    text-align: center;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .remove-btn {
    width: 28px;
    height: 28px;
    padding: 0;
    background: transparent;
    color: #d32f2f;
    border: 1px solid #d32f2f;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.2s;
  }

  .remove-btn:hover {
    background-color: #ffebee;
  }

  .item-total {
    min-width: 80px;
    text-align: right;
    font-weight: 600;
    color: #4d4738;
    font-size: 0.9rem;
  }

  .cart-actions {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 0 0.75rem 0;
    border-bottom: 1px solid #eee;
  }

  .total-label {
    font-weight: 500;
    color: #4d4738;
  }

  .total-price {
    font-weight: 700;
    font-size: 1.1rem;
    color: #755f4a;
  }

  .checkout-btn {
    background-color: #755f4a !important;
    color: white !important;
    font-size: 0.9rem !important;
  }

  .checkout-btn:hover {
    background-color: #634d3c !important;
  }

  @media (max-width: 640px) {
    .cart-overlay {
      --v-dialog-max-width: 95vw;
    }

    .cart-item {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
      padding: 0.75rem;
    }

    .item-info {
      flex: 1;
    }

    .item-title {
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .item-controls {
      width: 100%;
      display: grid;
      grid-template-columns: auto 30px auto 1fr;
      gap: 0.5rem;
      align-items: center;
    }

    .qty-btn {
      width: 26px;
      height: 26px;
      font-size: 0.8rem;
    }

    .qty-display {
      min-width: 20px;
      font-size: 0.85rem;
    }

    .remove-btn {
      width: 26px;
      height: 26px;
    }

    .item-total {
      width: 100%;
      text-align: right;
      margin-top: 0.25rem;
      font-size: 0.85rem;
    }

    .cart-title-header {
      font-size: 1.25rem;
      padding: 1rem;
    }

    .cart-content {
      max-height: 50vh;
      padding: 0 0.5rem;
    }

    .cart-actions {
      padding: 0.75rem;
    }

    .summary-row {
      font-size: 0.9rem;
    }

    .total-price {
      font-size: 1rem;
    }

    .checkout-btn {
      font-size: 0.85rem !important;
      padding: 0.5rem !important;
    }
  }
</style>
