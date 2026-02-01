<template>
  <div class="loader-container" v-show="isLoading">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
  </div>
  <div v-show="!isLoading">
    <v-app class="h-100">
      <Header />
      <v-main>
        <NuxtPage />
      </v-main>
      <Footer />
    </v-app>
  </div>
</template>

<script setup lang="ts">
  const settingsStore = useSettingsStore();
  const productStore = useProductsStore();

  // Start with loading = true until data is fetched
  const isLoading = ref(true);

  // Fetch products and settings before rendering
  await productStore.fetchAllProducts();
  await settingsStore.fetchSiteSettings();

  // Data is loaded
  isLoading.value = false;

  const site = computed(() => settingsStore.siteSettings);
  const { loading, bakingProducts, woodProducts } = productStore;
</script>

<style scoped>
  .loader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: oklch(0.96 0.01 70);
    z-index: 9999;
  }
</style>
