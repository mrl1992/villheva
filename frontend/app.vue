<template>
  <v-app class="h-100">
    <Header />
    <v-main>
      <NuxtPage />
    </v-main>
    <Footer />
    <PrivacyPolicyConsent />
  </v-app>
</template>

<script setup lang="ts">
  import PrivacyPolicyConsent from "./components/PrivacyPolicyConsent.vue";

  const settingsStore = useSettingsStore();
  const productStore = useProductsStore();

  // Resolved during SSR/prerender so the content is in the served HTML.
  // Pinia state is serialized into the payload, so the client reuses it on
  // hydration instead of refetching.
  await callOnce("app-data", () =>
    Promise.all([
      settingsStore.fetchSiteSettings(),
      productStore.fetchBakingProducts(),
      productStore.fetchWoodProducts(),
    ]),
  );
</script>
