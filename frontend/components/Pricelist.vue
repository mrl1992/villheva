<template>
  <div class="w-100 h-100 pricelist-wrapper">
    <div class="mb-12 pt-12">
      <h1 class="text-center hero-title" style="color: #c0ae94">Prisliste</h1>
      <p class="text-center" style="color: #c0ae94">
        Fersk brød bakt daglig og håndlagde trevarer laget med omsorg
      </p>
    </div>
    <v-row class="d-flex justify-center" cols="1" md="2" gap="12">
      <v-col>
        <h1 class="price-heading text-center">Brød & Boller</h1>
        <div class="d-flex flex-column ga-3 ml-4">
          <product-card-slim
            v-for="product in bestSellingBakingProducts.slice(0, 3)"
            :key="product._id"
            :product="product"
            @add="handleAdd"
          />
        </div>
      </v-col>
      <v-col class="ml-2">
        <h1 class="price-heading text-center">Trearbeid</h1>
        <div class="d-flex flex-column ga-3 mr-4">
          <product-card-slim
            v-for="product in bestSellingWoodProducts.slice(0, 3)"
            :key="product._id"
            :product="product"
            @add="handleAdd"
          />
        </div>
      </v-col>
    </v-row>

    <button
      class="products-arrow"
      aria-label="Gå til produkter"
      @click="goToProducts"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 12h14m-6-6l6 6-6 6"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
  import ProductCardSlim from "./ProductCardSlim.vue";

  const { bakingProducts, woodProducts } = useProductsStore();
  const goToProducts = () => navigateTo("/produkter");
  const handleAdd = (item) => {
    console.log("Added item:", item);
    // Add to cart logic here
  };

  const bestSellingBakingProducts = computed(() =>
    bakingProducts.filter((p) => p.bestSeller === true),
  );
  const bestSellingWoodProducts = computed(() =>
    woodProducts.filter((p) => p.bestSeller === true),
  );
</script>

<style lang="scss" scoped>
  .pricelist-wrapper {
    position: relative;
  }

  .price-heading {
    margin-bottom: 1.5rem;
    font-family: serif;
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 1.3;
    color: #c0ae94;
  }

  @media (min-width: 768px) {
    .price-heading {
      font-size: 1.875rem;
    }
  }

  .products-arrow {
    position: absolute;
    right: 1.25rem;
    bottom: 1.25rem;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    border: 1px solid rgba(192, 174, 148, 0.4);
    background-color: rgba(192, 174, 148, 0.15);
    color: #c0ae94;
    display: grid;
    place-items: center;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
    cursor: pointer;
  }

  .products-arrow:hover {
    transform: translateY(-2px);
    background-color: rgba(192, 174, 148, 0.25);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  .products-arrow svg {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
