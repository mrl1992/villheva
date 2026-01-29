<template>
  <section class="w-100 h-100 d-flex">
    <v-col class="w-50 d-flex align-center justify-end mr-12">
      <v-img
        src="/hero-sourdough.png"
        alt="Fersk surdeigbrød"
        class="hero-image rounded-xl"
        cover
      />
    </v-col>
    <v-col class="w-50 d-flex align-center justify-start">
      <div style="max-width: 30rem">
        <h1 class="hero-title">{{ siteSettings?.aboutUsTitle }}</h1>
        <p class="mb-4">
          {{ siteSettings?.aboutUsText1 }}
        </p>
        <p class="mb-4">
          {{ siteSettings?.aboutUsText2 }}
        </p>
        <p>
          {{ siteSettings?.aboutUsText3 }}
        </p>
      </div>
    </v-col>
  </section>
</template>

<script setup>
  const { siteSettings } = useSettingsStore();
</script>

<style lang="scss" scoped>
  .hero-image {
    width: 100%;
    max-width: 60%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }
</style>
