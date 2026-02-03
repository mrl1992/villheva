<template>
  <div class="gallery-page">
    <div class="gallery-container">
      <!-- Header -->
      <div class="gallery-header">
        <Title :title="'Galleri'" :show-header-lines="true" />
        <p class="gallery-subtitle">
          Utforsk vårt bildearkiv av håndverk og produkter
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="state-center">
        <p>Laster bilder...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="state-center">
        <p class="error-text">{{ error }}</p>
      </div>

      <!-- Gallery Content -->
      <div v-else>
        <!-- Gallery Grid -->
        <div v-if="productMedia.length > 0" class="gallery-grid">
          <article
            v-for="item in productMedia"
            :key="item._id"
            class="gallery-item"
          >
            <div class="image-wrapper">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.altText || item.title"
                :style="getImageStyle(item.imageDimensions)"
                class="gallery-image"
                loading="lazy"
              />
              <div v-else class="image-placeholder">
                <span>Ingen bilde</span>
              </div>
              <div class="image-overlay">
                <h3 class="image-title">{{ item.title }}</h3>
                <p v-if="item.description" class="image-description">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>Ingen produktbilder funnet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Title from "~/components/Title.vue";
  import { mediaService } from "~/services/mediaService";

  interface MediaItem {
    _id: string;
    title: string;
    category: string;
    imageUrl: string;
    imageDimensions?: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    altText?: string;
    description?: string;
    slug: string;
  }

  const loading = ref(true);
  const error = ref<string | null>(null);
  const productMedia = ref<MediaItem[]>([]);

  function getImageStyle(dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  }) {
    if (!dimensions) return {};

    // Create varied heights for masonry effect
    const aspectRatio = dimensions.aspectRatio || 1;
    if (aspectRatio > 1.5) {
      return { gridRowEnd: "span 1" };
    } else if (aspectRatio < 0.7) {
      return { gridRowEnd: "span 2" };
    }
    return {};
  }

  onMounted(async () => {
    try {
      loading.value = true;
      const media = await mediaService.getMediaByCategory("product");
      productMedia.value = media;
    } catch (err: any) {
      error.value = err.message || "Kunne ikke laste bilder";
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .gallery-page {
    min-height: 100vh;
    padding: 4rem 0;
  }

  .gallery-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .gallery-header {
    margin-bottom: 3rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .header-line {
    height: 1px;
    flex: 1;
    background: linear-gradient(to right, transparent, #c0ae94, transparent);
  }

  .gallery-title {
    font-family: "Playfair Display", serif;
    font-size: 3rem;
    font-weight: 400;
    color: #4d4738;
    white-space: nowrap;
  }

  .gallery-subtitle {
    text-align: center;
    font-size: 1.125rem;
    color: rgba(77, 71, 56, 0.7);
    margin-top: 0.5rem;
  }

  .state-center {
    text-align: center;
    padding: 4rem 0;
    color: #4d4738;
  }

  .error-text {
    color: #d32f2f;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
    grid-auto-rows: 260px;
  }

  .gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(192, 174, 148, 0.15);
    color: rgba(77, 71, 56, 0.5);
  }

  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(
      to top,
      rgba(77, 71, 56, 0.95),
      rgba(77, 71, 56, 0.7),
      transparent
    );
    padding: 2rem 1rem 1rem;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    color: #ffffff;
  }

  .gallery-item:hover .image-overlay {
    transform: translateY(0);
  }

  .image-title {
    font-family: "Playfair Display", serif;
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .image-description {
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    opacity: 0.9;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 0;
    color: rgba(77, 71, 56, 0.6);
  }

  @media (min-width: 640px) {
    .gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
    }
  }

  @media (min-width: 1024px) {
    .gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }
  }
</style>
