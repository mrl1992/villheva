<template>
  <div class="header-content">
    <div v-if="showHeaderLines" class="header-line" />
    <component :is="`h${level}`" class="hero-title" :style="{ color }">
      {{ title }}
    </component>
    <div v-if="showHeaderLines" class="header-line" />
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string;
    color?: string;
    showHeaderLines?: boolean;
    /**
     * Heading level. Defaults to 2 -- this component marks up section
     * headings, and a page must have exactly one h1. Pass level="1" only on
     * the heading that names the page.
     */
    level?: 1 | 2 | 3;
  }
  const {
    title,
    color = "black",
    showHeaderLines = false,
    level = 2,
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
