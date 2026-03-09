<template>
  <section class="about-section">
    <div class="about-container">
      <div class="image-column">
        <v-img
          :src="siteSettings?.frontpageAboutSectionPictureUrl"
          alt="Fersk surdeigbrød"
          class="hero-image rounded-xl"
          cover
        />
      </div>
      <div class="content-column">
        <div class="content-inner">
          <Title :title="siteSettings?.aboutUsTitle" color="#755f4a" />
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
      </div>
    </div>
  </section>
</template>

<script setup>
  import Title from "./Title.vue";

  const settingsStore = useSettingsStore();
  const { siteSettings } = storeToRefs(settingsStore);
</script>

<style lang="scss" scoped>
  .about-section {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .about-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 1400px;
  }

  @media (min-width: 960px) {
    .about-container {
      flex-direction: row;
      gap: 3rem;
    }
  }

  .image-column {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 960px) {
    .image-column {
      width: 50%;
      justify-content: flex-end;
      padding-right: 1.5rem;
    }
  }

  .hero-image {
    width: 100%;
    max-width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  @media (min-width: 600px) {
    .hero-image {
      max-width: 80%;
    }
  }

  @media (min-width: 960px) {
    .hero-image {
      max-width: 85%;
    }
  }

  .content-column {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 960px) {
    .content-column {
      width: 50%;
      justify-content: flex-start;
      padding-left: 1.5rem;
    }
  }

  .content-inner {
    max-width: 100%;
  }

  @media (min-width: 600px) {
    .content-inner {
      max-width: 30rem;
    }
  }

  .hero-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
  }
</style>
