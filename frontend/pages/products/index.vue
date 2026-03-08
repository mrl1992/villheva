<template>
  <div>
    <section class="section-light">
      <div class="section-container">
        <div v-if="store.loading" class="state-center">
          <p>Laster produkter...</p>
        </div>

        <div v-else-if="store.error" class="state-center">
          <p>{{ store.error }}</p>
        </div>

        <div v-else>
          <Title
            class="mb-8"
            :title="`Brød & Bakevarer`"
            :show-header-lines="true"
          />

          <div class="products-list">
            <NuxtLink
              v-for="product in breadProducts"
              :key="product._id"
              :to="`/products/${product.slug}`"
              class="product-link"
            >
              <article class="product-row product-row-light">
                <div class="product-image-wrap">
                  <img
                    v-if="product.imageUrls?.length"
                    :src="product.imageUrls[0]"
                    :alt="`${product.title} - Villheva bakevarer`"
                    class="product-image"
                  />
                  <div v-else class="image-placeholder">/placeholder.svg</div>
                  <span
                    v-if="product.bestSeller"
                    class="bestseller-badge bestseller-badge-light"
                  >
                    ⭐ Bestselger
                  </span>
                </div>
                <div class="product-content">
                  <div>
                    <div class="product-title-row">
                      <h3 class="product-title-light">{{ product.title }}</h3>
                      <span class="product-badge-light">
                        {{ product.weight ? `${product.weight}g` : "N/A" }}
                      </span>
                    </div>
                  </div>
                  <div class="product-footer">
                    <div class="price-stock-wrapper">
                      <span class="product-price-light">
                        {{ product.price }} kr
                      </span>
                      <span
                        :class="[
                          'stock-indicator',
                          product.inStock !== false
                            ? 'in-stock-light'
                            : 'out-of-stock-light',
                        ]"
                      >
                        {{
                          product.inStock !== false ? "✓ På lager" : "✕ Utsolgt"
                        }}
                      </span>
                    </div>
                    <button
                      class="product-button-light"
                      type="button"
                      :disabled="product.inStock === false"
                      @click.prevent.stop="addToCartHandler(product)"
                    >
                      Legg til kurv
                    </button>
                  </div>
                </div>
              </article>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section-dark">
      <div class="section-container">
        <Title
          class="mb-8"
          :title="`Trearbeide`"
          :show-header-lines="true"
          color="#c0ae94"
        />

        <div class="products-list">
          <NuxtLink
            v-for="product in woodProducts"
            :key="product._id"
            :to="`/products/${product.slug}`"
            class="product-link"
          >
            <article class="product-row product-row-dark">
              <div class="product-image-wrap">
                <img
                  v-if="product.imageUrls?.length"
                  :src="product.imageUrls[0]"
                  :alt="product.title"
                  class="product-image"
                />
                <div v-else class="image-placeholder">/placeholder.svg</div>
                <span
                  v-if="product.bestSeller"
                  class="bestseller-badge bestseller-badge-dark"
                >
                  ⭐ Bestselger
                </span>
              </div>
              <div class="product-content">
                <div>
                  <div class="product-title-row">
                    <h3 class="product-title-dark">{{ product.title }}</h3>
                  </div>
                  <p class="product-description-dark">
                    {{ product.description || "Håndlaget med omtanke" }}
                  </p>
                </div>
                <div class="product-footer">
                  <div class="price-stock-wrapper">
                    <span class="product-price-dark"
                      >{{ product.price }} kr</span
                    >
                    <span
                      :class="[
                        'stock-indicator',
                        product.inStock !== false
                          ? 'in-stock-dark'
                          : 'out-of-stock-dark',
                      ]"
                    >
                      {{
                        product.inStock !== false ? "✓ På lager" : "✕ Utsolgt"
                      }}
                    </span>
                  </div>
                  <button
                    class="product-button-dark"
                    type="button"
                    :disabled="product.inStock === false"
                    @click.prevent.stop="addToCartHandler(product)"
                  >
                    Legg til kurv
                  </button>
                </div>
              </div>
            </article>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import Title from "~/components/Title.vue";
  import { useProductsStore } from "~/stores/products.store";
  import { useCartStore } from "~/stores/cart.store";

  const store = useProductsStore();
  const cartStore = useCartStore();

  const breadProducts = computed(() => store.bakingProducts);
  const woodProducts = computed(() => store.woodProducts);

  const addToCartHandler = (product: any) => {
    cartStore.addToCart(product);
  };

  // SEO
  useSeo({
    title: "Produkter - Brød & Bakevarer | Villheva",
    description:
      "Utforsk vårt utvalg av fersk surdeigbrød, bakevarer og håndlagde trearbeider.",
    type: "website",
  });

  onMounted(() => {
    store.fetchAllProducts();
  });
</script>

<style scoped>
  .section-light {
    padding: 4rem 1.5rem;
    background-color: oklch(0.96 0.01 70);
  }

  .section-dark {
    padding: 4rem 1.5rem;
    background: #4d4738;
  }

  .section-container {
    max-width: 72rem;
    margin: 0 auto;
  }

  .state-center {
    text-align: center;
    padding: 3rem 0;
  }

  .section-title-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  .section-line {
    height: 1px;
    flex: 1;
    background: #c0ae94;
  }

  .section-line-dark {
    height: 1px;
    flex: 1;
    background: #755f4a;
  }

  .section-title {
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    color: #4d4738;
  }

  .section-title-dark {
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    color: #c0ae94;
  }

  .products-list {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 2rem;
  }

  .product-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .product-row {
    display: flex;
    gap: 1.5rem;
    padding: 1rem;
    border-radius: 1.5rem;
    transition: background-color 0.3s ease;
    cursor: pointer;
  }

  .product-row-light {
    background: #ffffff;
  }

  .product-row-light:hover {
    background: rgba(192, 174, 148, 0.2);
  }

  .product-row-dark {
    background: #5a5344;
  }

  .product-row-dark:hover {
    background: #6a6354;
  }

  .product-image-wrap {
    width: 8rem;
    height: 8rem;
    border-radius: 1rem;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    display: block;
  }

  .product-row:hover .product-image {
    transform: scale(1.05);
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(77, 71, 56, 0.6);
    background: rgba(192, 174, 148, 0.15);
    font-size: 0.8rem;
  }

  .product-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    min-width: 0;
    padding: 0.25rem 0;
  }

  .product-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .product-title-light {
    font-family: "Playfair Display", serif;
    font-size: 1.25rem;
    color: #4d4738;
  }

  .product-title-dark {
    font-family: "Playfair Display", serif;
    font-size: 1.25rem;
    color: #f5f2ed;
  }

  .product-badge-light {
    font-size: 0.75rem;
    color: #755f4a;
    background: rgba(192, 174, 148, 0.4);
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .product-badge-dark {
    font-size: 0.75rem;
    color: #c0ae94;
    background: #755f4a;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .product-description-light {
    color: rgba(77, 71, 56, 0.6);
    font-size: 0.875rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-description-dark {
    color: rgba(186, 185, 167, 0.8);
    font-size: 0.875rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.75rem;
  }

  .price-stock-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stock-indicator {
    font-size: 0.75rem;
    font-weight: 500;
  }

  .in-stock-light {
    color: #2e7d32;
  }

  .out-of-stock-light {
    color: #c62828;
  }

  .in-stock-dark {
    color: #81c784;
  }

  .out-of-stock-dark {
    color: #ef5350;
  }

  .product-price-light {
    font-family: "Playfair Display", serif;
    font-size: 1.5rem;
    color: #755f4a;
    font-weight: 600;
  }

  .product-price-dark {
    font-family: "Playfair Display", serif;
    font-size: 1.5rem;
    color: #c0ae94;
    font-weight: 600;
  }

  .product-button-light {
    border: none;
    border-radius: 999px;
    background: #755f4a;
    color: #ffffff;
    padding: 0.45rem 1rem;
    height: 2.25rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .product-button-light:hover:not(:disabled) {
    background: #4d4738;
  }

  .product-button-light:disabled {
    background: #d0d0d0;
    color: #888;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .product-button-dark {
    border: none;
    border-radius: 999px;
    background: #c0ae94;
    color: #4d4738;
    padding: 0.45rem 1rem;
    height: 2.25rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .product-button-dark:hover:not(:disabled) {
    background: #bab9a7;
  }

  .product-button-dark:disabled {
    background: #6a6354;
    color: #999;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .bestseller-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.25rem 0.625rem;
    border-radius: 999px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    backdrop-filter: blur(4px);
  }

  .bestseller-badge-light {
    background: rgba(186, 185, 167, 0.9);
    color: #4d4738;
  }

  .bestseller-badge-dark {
    background: rgba(186, 185, 167, 0.95);
    color: #4d4738;
  }

  @media (min-width: 768px) {
    .section-title {
      font-size: 2.5rem;
    }

    .section-title-dark {
      font-size: 2.5rem;
    }

    .products-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .product-image-wrap {
      width: 10rem;
      height: 10rem;
    }

    .product-title-light,
    .product-title-dark {
      font-size: 1.5rem;
    }
  }
</style>
