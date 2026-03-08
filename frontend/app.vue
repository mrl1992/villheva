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
      <PrivacyPolicyConsent />
    </v-app>
  </div>
</template>

<script setup lang="ts">
  import LoadingOverlay from "./components/LoadingOverlay.vue";
  import PrivacyPolicyConsent from "./components/PrivacyPolicyConsent.vue";

  const settingsStore = useSettingsStore();
  const productStore = useProductsStore();

  const isLoading = ref(true);

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
    }, 200); // Optional: small delay to show loader
  });

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
