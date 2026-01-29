<template>
  <v-container class="py-10">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">
      Tilbake
    </v-btn>

    <div v-if="pending" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
      Kunne ikke laste produktet.
    </v-alert>

    <div v-else-if="product" class="d-flex flex-column flex-md-row ga-8">
      <v-img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        max-width="420"
        aspect-ratio="1"
        class="rounded-lg"
        cover
      />

      <div class="flex-1">
        <h1 class="text-h4 mb-2">{{ product.title }}</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-4">
          {{ product.price }} kr
        </p>
        <p v-if="product.weight" class="text-body-2 text-medium-emphasis mb-2">
          {{ product.weight }}g
        </p>
        <p v-if="product.description" class="text-body-1 mb-6">
          {{ product.description }}
        </p>

        <div v-if="product.allergens?.length" class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="allergen in product.allergens"
            :key="allergen._id"
            size="small"
            color="brown"
            variant="tonal"
          >
            {{ allergen.title }}
          </v-chip>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { sanityService } from "~/services/sanityService";

  const route = useRoute();
  const slug = route.params.slug as string;

  const {
    data: product,
    error,
    pending,
  } = await useAsyncData(
    `product-${slug}`,
    () => sanityService.getProductBySlug(slug),
    { watch: [() => route.params.slug] },
  );
</script>
