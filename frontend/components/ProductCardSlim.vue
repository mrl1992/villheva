<template>
  <div class="pb-6">
    <v-card
      v-if="product"
      class="pa-5 rounded-xl"
      elevation="2"
      color="#C0AE94"
      variant="elevated"
    >
      <div class="d-flex align-center justify-space-between ga-4">
        <div class="flex-1-1">
          <h4 class="text-brown-700 font-weight-medium mb-1">
            {{ product.title }}
          </h4>
          <p class="text-body-2 text-brown-700 text-opacity-70">
            {{ product.weight ?? product.description }}
          </p>
        </div>

        <div class="d-flex align-center ga-3">
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
    price: number;
    weight?: string;
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
</style>
