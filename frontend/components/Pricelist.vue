<template>
  <div class="w-100 h-100">
    <div class="mb-12">
      <h1 class="text-center price-heading">Prisliste</h1>
      <p class="text-center" style="color: #c0ae94">
        Fersk brød bakt daglig og håndlagde trevarer laget med omsorg
      </p>
    </div>
    <v-row class="d-flex justify-center" cols="1" md="2" gap="12">
      <v-col>
        <h1 class="price-heading text-center">Brød & Boller</h1>
        <div class="d-flex flex-column ga-3 ml-4">
          <product-card-slim
            v-for="product in bakingProducts"
            :key="product._id"
            :product="product"
            @add="handleAdd"
          />
        </div>
      </v-col>
      <v-col>
        <h1 class="price-heading text-center">Trearbeid</h1>
        <div class="d-flex flex-column ga-3 ml-4">
          <product-card-slim
            v-for="product in woodProducts"
            :key="product._id"
            :product="product"
            @add="handleAdd"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import ProductCardSlim from "./ProductCardSlim.vue";

  const { bakingProducts, woodProducts } = useProductsStore();
  const handleAdd = (item) => {
    console.log("Added item:", item);
    // Add to cart logic here
  };
</script>

<style lang="scss" scoped>
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
</style>
