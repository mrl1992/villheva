<template>
  <div class="mt-0 pa-0">
    <div v-if="isProduction" class="production-wrapper">
      <div class="maintenance-overlay">
        <div class="maintenance-content">
          <h1>Nettstedet er under oppsett</h1>
          <p>Vi arbeider for å få nettstedet klart snart. Takk for tålmodigheten!</p>
        </div>
      </div>
    </div>
    <template v-else>
      <section class="hero-section">
      <v-img
        :src="site?.heroImageUrl"
        alt="Fersk surdeigbrød"
        cover
        class="hero-image"
      >
        <div class="hero-overlay"></div>
      </v-img>

      <div class="hero-content">
        <div class="content-wrapper">
          <h2 class="hero-title">
            {{ site?.heroTitle }}
          </h2>

          <p class="hero-subtitle">
            {{ site?.heroSubtitle }}
          </p>

          <!-- Buttons -->
          <div class="button-group">
            <NuxtLink to="/products">
              <v-btn size="large" class="btn-primary">
                {{ site?.heroCtaLabel }}
              </v-btn>
            </NuxtLink>
            <v-btn size="large" variant="outlined" class="btn-secondary">
              Les vår historie
            </v-btn>
          </div>
        </div>
      </div>

      <div class="scroll-indicator">
        <svg
          class="bounce-arrow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
    <section
      style="
        min-height: 80vh;
        background-color: oklch(0.96 0.01 70);
        display: flex;
        align-items: center;
      "
    >
      <about />
    </section>
    <section class="pricelist-section">
      <pricelist />
    </section>
    <section
      id="contact"
      class="d-flex align-center justify-center"
      style="
        min-height: 700px;
        background-color: linear-gradient(#faf9f7);
        padding: 3rem 1.5rem;
      "
    >
      <contact-form />
    </section>
    </template>
  </div>
</template>

<script setup lang="ts">
  import About from "~/components/About.vue";
  import Pricelist from "~/components/Pricelist.vue";
  import ContactForm from "~/components/ContactForm.vue";

  const settingsStore = useSettingsStore();
  const isProduction = process.env.NODE_ENV === "production";

  const site = computed(() => settingsStore.siteSettings);
</script>

<style scoped>
  .hero-section {
    position: relative;
    min-height: 95vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 4rem;
    overflow: hidden;
    background-color: #755f4a;
  }

  @media (min-width: 640px) {
    .hero-section {
      padding-top: 5rem;
    }
  }

  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(77, 71, 56, 0.7) 0%,
      rgba(117, 95, 74, 0.6) 50%,
      rgba(192, 174, 148, 0.5) 100%
    );
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 5rem 1rem;
    text-align: center;
  }

  .pricelist-section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    background-color: rgb(var(--v-theme-olive));
    width: 100%;
    overflow-x: hidden;
    padding: 2rem 1rem;
  }

  @media (min-width: 640px) {
    .hero-content {
      padding: 8rem 1.5rem;
    }
    .pricelist-section {
      height: auto;
      padding: 3rem 1rem;
    }
  }

  .content-wrapper {
    max-width: 56rem;
    margin: 0 auto;
  }

  .hero-title {
    font-family: serif;
    font-size: 2rem;
    font-weight: 400;
    color: white;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  @media (min-width: 480px) {
    .hero-title {
      font-size: 2.5rem;
    }
  }

  @media (min-width: 640px) {
    .hero-title {
      font-size: 3rem;
    }
  }

  @media (min-width: 768px) {
    .hero-title {
      font-size: 3.5rem;
    }
  }

  @media (min-width: 1024px) {
    .hero-title {
      font-size: 4.5rem;
    }
  }

  @media (min-width: 1280px) {
    .hero-title {
      font-size: 5rem;
    }
  }

  .hero-subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    max-width: 42rem;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }

  @media (min-width: 640px) {
    .hero-subtitle {
      font-size: 1.125rem;
      margin-bottom: 2.5rem;
    }
  }

  @media (min-width: 768px) {
    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 3rem;
    }
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 480px) {
    .button-group {
      gap: 1rem;
    }
  }

  @media (min-width: 640px) {
    .button-group {
      flex-direction: row;
      gap: 1.5rem;
    }
  }

  .btn-primary {
    background-color: #c0ae94 !important;
    color: #4d4738 !important;
    border-radius: 9999px !important;
    padding: 0.75rem 2rem !important;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-primary:hover {
    background-color: rgba(192, 174, 148, 0.9) !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .btn-secondary {
    border: 2px solid rgba(255, 255, 255, 0.4) !important;
    color: white !important;
    border-radius: 9999px !important;
    padding: 0.75rem 2rem !important;
    background: transparent !important;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.6) !important;
  }

  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .bounce-arrow {
    width: 1.5rem;
    height: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.5rem);
    }
  }

  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: oklch(0.96 0.01 70);
  }

  .production-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }

  .maintenance-overlay {
    width: 100%;
    height: 100%;
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
