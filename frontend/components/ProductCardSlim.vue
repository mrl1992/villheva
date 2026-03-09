<template>
  <div class="pb-3">
    <v-card
      v-if="product"
      class="pa-5 rounded-xl pricelist-card"
      elevation="2"
      color="#C0AE94"
      variant="elevated"
    >
      <div class="d-flex align-center justify-space-between ga-4">
        <div class="product-info">
          <h4 class="product-title text-brown-700 font-weight-medium mb-1">
            <NuxtLink :to="`/products/${product.slug}`" class="product-link">
              {{ product.title }}
            </NuxtLink>
          </h4>
          <div style="min-height: 1.5rem">
            <p
              class="text-body-2 text-brown-700 text-opacity-70 mb-0"
              v-if="product.weight"
            >
              {{ `${product.weight}g` }}
            </p>
          </div>
        </div>

        <div class="product-actions">
          <span
            class="text-h6 font-serif font-weight-semibold"
            style="color: #755f4a"
          >
            {{ product.price }} kr
          </span>

          <v-btn
            icon
            size="small"
            color="#755F4A"
            class="elevation-2"
            @click="onAdd(product)"
          >
            <v-icon size="18">mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  interface Item {
    id: string | number;
    title: string;
    slug: string;
    price: number;
    weight?: number;
    inStock?: boolean;
    category?: string;
    description?: string;
  }

  const props = defineProps<{
    product: Item | null;
  }>();

  const emit = defineEmits<{
    (e: "add", payload: Item & { size?: string; category?: string }): void;
  }>();

  const onAdd = (item: Item) => {
    emit("add", {
      ...item,
      size: item.weight,
      category: item.category,
    });
  };
</script>

<style scoped>
  .text-brown-200 {
    color: #c0ae94;
  }
  .text-brown-700 {
    color: #4d4738;
  }

  .pricelist-card {
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
  }

  .product-info {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
  }

  .product-title {
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    line-height: 1.3;
  }

  .product-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .product-link {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .product-link:hover {
    opacity: 0.7;
  }
</style>
