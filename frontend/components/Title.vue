<template>
  <div class="header-content">
    <div v-if="showHeaderLines" class="header-line" />
    <h1 class="hero-title" :style="{ color }">{{ title }}</h1>
    <div v-if="showHeaderLines" class="header-line" />
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string;
    color?: string;
    showHeaderLines?: boolean;
  }
  const {
    title,
    color = "black",
    showHeaderLines = false,
  } = defineProps<Props>();
</script>

<style scoped>
  .hero-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1;
    margin: 0;
  }
  .header-line {
    height: 1px;
    flex: 1;
    background: linear-gradient(to right, transparent, #c0ae94, transparent);
  }
  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
    width: 100%;
    text-align: center;
  }
</style>
