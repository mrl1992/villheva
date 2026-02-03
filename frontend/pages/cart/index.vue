<template>
  <div class="cart-container">
    <div class="section-container">
      <h1 class="cart-title">Handlekurv</h1>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <p>Kurven er tom</p>
        <NuxtLink to="/products" class="back-link">Gå til produkter</NuxtLink>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
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
                Fjern
              </button>
            </div>

            <div class="item-total">
              {{ item.price * item.quantity }} kr
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Totalt:</span>
            <span class="total-price">{{ cartStore.cartTotal }} kr</span>
          </div>
          <button class="checkout-btn">Gå til betaling</button>
          <NuxtLink to="/products" class="continue-shopping"
            >Fortsett shopping</NuxtLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const cartStore = useCartStore();
</script>

<style scoped>
  .cart-container {
    min-height: 100vh;
    padding: 100px 1.5rem 2rem;
    background-color: oklch(0.96 0.01 70);
  }

  .section-container {
    max-width: 72rem;
    margin: 0 auto;
  }

  .cart-title {
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    color: #4d4738;
    margin-bottom: 2rem;
    text-align: center;
  }

  .empty-cart {
    text-align: center;
    padding: 3rem 1rem;
  }

  .empty-cart p {
    font-size: 1.1rem;
    color: #4d4738;
    margin-bottom: 1.5rem;
  }

  .back-link,
  .continue-shopping {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #c0ae94;
    color: #4d4738;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .back-link:hover,
  .continue-shopping:hover {
    background-color: #b39a7f;
  }

  .cart-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
  }

  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .item-info {
    flex: 1;
  }

  .item-title {
    font-weight: 600;
    color: #4d4738;
    margin: 0 0 0.5rem 0;
  }

  .item-weight {
    font-size: 0.9rem;
    color: #999;
    margin: 0.25rem 0;
  }

  .item-price {
    font-weight: 500;
    color: #755f4a;
    margin: 0;
  }

  .item-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .qty-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #c0ae94;
    background: white;
    color: #4d4738;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .qty-btn:hover {
    background-color: #c0ae94;
  }

  .qty-display {
    min-width: 30px;
    text-align: center;
    font-weight: 500;
  }

  .remove-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    color: #d32f2f;
    border: 1px solid #d32f2f;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .remove-btn:hover {
    background-color: #ffebee;
  }

  .item-total {
    min-width: 100px;
    text-align: right;
    font-weight: 600;
    color: #4d4738;
  }

  .cart-summary {
    position: sticky;
    top: 100px;
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    height: fit-content;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }

  .total-price {
    font-weight: 700;
    font-size: 1.25rem;
    color: #4d4738;
  }

  .checkout-btn {
    width: 100%;
    padding: 0.875rem;
    background-color: #755f4a;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 0.75rem;
    transition: background-color 0.2s;
  }

  .checkout-btn:hover {
    background-color: #634d3c;
  }

  .continue-shopping {
    display: block;
    text-align: center;
    background-color: #c0ae94;
  }

  @media (max-width: 768px) {
    .cart-container {
      padding-top: 80px;
    }

    .cart-content {
      grid-template-columns: 1fr;
    }

    .cart-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .item-controls {
      width: 100%;
      justify-content: space-between;
    }

    .item-total {
      width: 100%;
      text-align: right;
    }

    .cart-summary {
      position: static;
    }
  }
</style>
