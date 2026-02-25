<template>
  <div v-if="isProduction" class="production-wrapper">
    <div class="maintenance-overlay">
      <div class="maintenance-content">
        <img src="/logo.png" alt="Villheva Logo" class="logo" />
        <h1>Nettstedet er under oppsett</h1>
        <p>
          Vi arbeider for å få nettstedet klart snart. Takk for tålmodigheten!
        </p>
      </div>
    </div>
  </div>
  <div v-else>
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
  </div>
</template>

<script setup lang="ts">
  import LoadingOverlay from "./components/LoadingOverlay.vue";

  const settingsStore = useSettingsStore();
  const productStore = useProductsStore();
  const isProduction = process.env.NODE_ENV === "production";

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

  .production-wrapper {
    width: 100%;
    min-height: 100vh;
  }

  .maintenance-overlay {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(
      135deg,
      rgba(77, 71, 56, 0.95) 0%,
      rgba(117, 95, 74, 0.95) 50%,
      rgba(192, 174, 148, 0.9) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .maintenance-content {
    text-align: center;
    color: white;
    max-width: 500px;
  }

  .logo {
    width: 100px;
    height: auto;
    margin: 0 auto 2rem;
    display: block;
  }

  .maintenance-content h1 {
    font-family: "Playfair Display", serif;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 400;
  }

  .maintenance-content p {
    font-size: 1.125rem;
    line-height: 1.6;
    opacity: 0.95;
  }

  @media (min-width: 640px) {
    .maintenance-content h1 {
      font-size: 3.5rem;
    }

    .maintenance-content p {
      font-size: 1.25rem;
    }
  }
</style>
