<template>
  <v-app-bar :elevation="0" class="app-bar-custom">
    <template v-slot:prepend>
      <img src="/logo.png" alt="Villheva" class="logo" />
    </template>
    <v-app-bar-title class="ml-n2 app-bar-title">Villheva</v-app-bar-title>
    <v-btn
      variant="plain"
      v-for="tab in tabs"
      :key="tab"
      :to="tab === 'Home' ? '/' : `/${tab.toLowerCase()}`"
    >
      {{ tab }}
    </v-btn>
    <v-btn icon class="mr-6">
      <v-badge location="top right" color="seafoam" content="4">
        <v-icon color="earth"> mdi-cart </v-icon>
      </v-badge>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { mediaService } from "~/services/mediaService";

  const tabs = ref(["Products", "Gallery", "About"]);
</script>

<style scoped>
  .app-bar-custom {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50 !important;
    background-color: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(186, 185, 167, 0.3) !important;
  }

  .logo {
    height: 40px;
    width: auto;
    margin: 0 12px;
  }

  .app-bar-title {
    font-family: "Bree Serif", serif !important;
    font-size: 1.5rem !important;
    color: #4d4738 !important;
    font-style: italic !important;
  }

  @media (min-width: 640px) {
    .app-bar-title {
      font-size: 1.875rem !important;
    }
  }
</style>
