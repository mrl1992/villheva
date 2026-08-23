<template>
  <div class="w-100 h-100 pricelist-wrapper">
    <div class="mb-12">
      <Title title="Prisliste" color="#c0ae94" />
      <p class="text-center" style="color: #c0ae94">
        Våre brød og bakeverk lages hver helg, i ferier og høytider, men også på
        forespørsel
      </p>
    </div>
    <v-row
      class="d-flex justify-center pricelist-row"
      cols="1"
      md="2"
      no-gutters
    >
      <v-col class="pricelist-col">
        <h3 class="price-heading text-center">Brød & Bakeverk</h3>
        <div class="d-flex flex-column ga-2 product-list product-list-left">
          <product-card-slim
            v-for="product in bestSellingBakingProducts.slice(0, 4)"
            :key="product._id"
            :product="product"
            @add="handleAdd"
          />
        </div>
      </v-col>
      <v-col class="wood-column pricelist-col">
        <h3 class="price-heading text-center">Trearbeid</h3>
        <div class="d-flex flex-column ga-2 product-list product-list-right">
          <product-card-slim
            v-for="product in bestSellingWoodProducts.slice(0, 4)"
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
  import Title from "./Title.vue";

  const productsStore = useProductsStore();
  const cartStore = useCartStore();
  const { bakingProducts, woodProducts } = storeToRefs(productsStore);

  const goToProducts = () => navigateTo("/produkter");
  const handleAdd = (item) => {
    cartStore.addToCart(item);
    console.log("Added to cart:", item);
  };

  const bestSellingBakingProducts = computed(() =>
    bakingProducts.value.filter((p) => p.inStock === true),
  );
  const bestSellingWoodProducts = computed(() =>
    woodProducts.value.filter((p) => p.inStock === true),
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

  .wood-column {
    margin-left: 0;
  }

  .product-list {
    margin-left: 0;
    margin-right: 0;
  }

  .pricelist-row {
    column-gap: 150px;
  }

  .pricelist-col {
    flex: 0 1 520px;
    max-width: 520px;
  }

  @media (max-width: 768px) {
    .pricelist-row {
      column-gap: 0;
    }

    .pricelist-col {
      flex: 0 1 100%;
      max-width: 100%;
    }
  }

  @media (min-width: 960px) {
    .wood-column {
      margin-left: 0;
    }

    .product-list-left {
      margin-left: 0;
    }

    .product-list-right {
      margin-right: 0;
    }
  }
</style>
