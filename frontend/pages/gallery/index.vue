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
            @click="openPreview(item)"
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

    <!-- Image Preview Modal -->
    <div v-if="selectedImage" class="preview-modal" @click.self="closePreview">
      <div class="preview-content">
        <button class="close-button" @click="closePreview" aria-label="Close">
          ✕
        </button>
        <button
          class="nav-button nav-prev"
          @click="previousImage"
          aria-label="Previous image"
        >
          ←
        </button>
        <button
          class="nav-button nav-next"
          @click="nextImage"
          aria-label="Next image"
        >
          →
        </button>
        <div class="preview-inner">
          <div class="preview-image-wrapper">
            <img
              v-if="selectedImage.imageUrl"
              :src="selectedImage.imageUrl"
              :alt="selectedImage.altText || selectedImage.title"
              class="preview-image"
            />
            <div class="preview-overlay">
              <h2 class="preview-title">{{ selectedImage.title }}</h2>
              <p v-if="selectedImage.description" class="preview-description">
                {{ selectedImage.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="preview-counter">
          {{ currentImageIndex + 1 }} / {{ productMedia.length }}
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
  const selectedImage = ref<MediaItem | null>(null);
  const currentImageIndex = ref(0);

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

  function openPreview(item: MediaItem) {
    selectedImage.value = item;
    currentImageIndex.value = productMedia.value.findIndex(
      (media) => media._id === item._id,
    );
    document.body.style.overflow = "hidden";
  }

  function closePreview() {
    selectedImage.value = null;
    document.body.style.overflow = "";
  }

  function nextImage() {
    const nextIndex =
      (currentImageIndex.value + 1) % productMedia.value.length;
    selectedImage.value = productMedia.value[nextIndex];
    currentImageIndex.value = nextIndex;
  }

  function previousImage() {
    const prevIndex =
      currentImageIndex.value === 0
        ? productMedia.value.length - 1
        : currentImageIndex.value - 1;
    selectedImage.value = productMedia.value[prevIndex];
    currentImageIndex.value = prevIndex;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!selectedImage.value) return;

    if (event.key === "Escape") {
      closePreview();
    } else if (event.key === "ArrowRight") {
      nextImage();
    } else if (event.key === "ArrowLeft") {
      previousImage();
    }
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

    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
    document.body.style.overflow = "";
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
    cursor: pointer;
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

  /* Preview Modal Styles */
  .preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .preview-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: transparent;
    border-radius: 1rem;
    overflow: visible;
  }

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .close-button {
    position: fixed;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
    z-index: 1001;
  }

  .close-button:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .nav-button {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    font-size: 2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
    z-index: 1001;
  }

  .nav-button:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .nav-prev {
    left: 1rem;
  }

  .nav-next {
    right: 1rem;
  }

  .preview-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #ffffff;
    border-radius: 1rem;
    overflow: hidden;
    animation: slideUp 0.3s ease;
  }

  .preview-image-wrapper {
    position: relative;
    width: 100%;
    max-height: 70vh;
  }

  .preview-image {
    width: 100%;
    height: auto;
    display: block;
    max-height: 70vh;
    object-fit: contain;
  }

  .preview-overlay {
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
    color: #ffffff;
  }

  .preview-title {
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    font-weight: 500;
    color: #ffffff;
    margin: 0 0 0.5rem 0;
  }

  .preview-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #ffffff;
    margin: 0;
    opacity: 0.9;
  }

  .preview-counter {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    z-index: 1001;
  }

  @media (max-width: 768px) {
    .preview-content {
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
    }

    .preview-inner {
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
    }

    .preview-image-wrapper {
      max-height: 100vh;
    }

    .preview-image {
      max-height: 100vh;
    }

    .preview-overlay {
      padding: 1.5rem 1rem;
    }

    .preview-title {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .preview-description {
      font-size: 0.95rem;
    }

    .nav-button {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.5rem;
    }

    .nav-prev {
      left: 0.5rem;
    }

    .nav-next {
      right: 0.5rem;
    }

    .close-button {
      width: 2rem;
      height: 2rem;
      font-size: 1.25rem;
      top: 0.5rem;
      right: 0.5rem;
    }

    .preview-counter {
      bottom: 0.5rem;
    }
  }
</style>
