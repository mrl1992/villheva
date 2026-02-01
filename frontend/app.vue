<template>
  <div class="loader-container" v-show="isLoading">
    <LoadingOverlay />
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
  import LoadingOverlay from "./components/LoadingOverlay.vue";

  const settingsStore = useSettingsStore();
  const productStore = useProductsStore();

  // Start with loading = true until data is fetched
  const isLoading = ref(true);

  // Fetch products and settings before rendering
  const fetchData = async () => {
    await Promise.all([
      settingsStore.fetchSiteSettings(),
      productStore.fetchBakingProducts(),
      productStore.fetchWoodProducts(),
    ]);
  };
  onMounted(async () => {
    setTimeout(async () => {
      await fetchData();
      isLoading.value = false;
    }, 500); // Optional: small delay to show loader
  });

  // Data is loaded
  isLoading.value = false;

  const site = computed(() => settingsStore.siteSettings);
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
