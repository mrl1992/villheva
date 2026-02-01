<template>
  <v-container class="py-8 py-md-12">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="$router.back()"
      class="mb-6"
    >
      Tilbake
    </v-btn>

    <div v-if="pending" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
      Kunne ikke laste produktet.
    </v-alert>

    <div v-else-if="product" class="product-detail">
      <v-row>
        <!-- Product Image -->
        <v-col cols="12" md="6">
          <v-card elevation="2" class="product-image-card">
            <v-carousel
              v-if="product.imageUrls?.length && product.imageUrls.length > 1"
              height="100%"
              hide-delimiter-background
              show-arrows
            >
              <v-carousel-item
                v-for="(imageUrl, index) in product.imageUrls"
                :key="`${product._id}-${index}`"
              >
                <v-img
                  :src="imageUrl"
                  aspect-ratio="1"
                  class="rounded-lg"
                  cover
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        indeterminate
                        color="grey-lighten-2"
                      />
                    </div>
                  </template>
                </v-img>
              </v-carousel-item>
            </v-carousel>
            <v-img
              v-else-if="product.imageUrls?.length"
              :src="product.imageUrls[0]"
              aspect-ratio="1"
              class="rounded-lg"
              cover
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey-lighten-2" />
                </div>
              </template>
            </v-img>
            <v-img
              v-else
              src="/placeholder.jpg"
              aspect-ratio="1"
              class="rounded-lg"
              cover
            />
          </v-card>
        </v-col>

        <!-- Product Info -->
        <v-col cols="12" md="6">
          <div class="product-info">
            <Title style="justify-content: start" :title="product.title" />

            <!-- Price and Stock -->
            <div class="d-flex align-center gap-3 mb-6">
              <p class="product-price text-h4 font-weight-bold mb-0">
                {{ product.price }} kr
              </p>
              <v-chip
                :color="product.inStock ? 'success' : 'error'"
                variant="flat"
                size="small"
              >
                <v-icon
                  start
                  :icon="
                    product.inStock ? 'mdi-check-circle' : 'mdi-alert-circle'
                  "
                />
                {{ product.inStock ? "På lager" : "Utsolgt" }}
              </v-chip>
            </div>

            <!-- Weight -->
            <p
              v-if="product.weight"
              class="text-body-1 text-medium-emphasis mb-4"
            >
              <v-icon icon="mdi-weight" size="small" class="mr-1" />
              {{ product.weight }}g
            </p>

            <!-- Description -->
            <p
              v-if="product.description"
              class="text-body-1 mb-6 product-description"
            >
              {{ product.description }}
            </p>

            <v-divider class="my-6" />

            <!-- Quantity Counter & Add to Cart -->
            <div class="cart-section">
              <h3 class="text-h6 mb-4">Velg antall</h3>
              <div class="d-flex align-center gap-4 mb-4">
                <div class="quantity-control d-flex align-center">
                  <v-btn
                    icon="mdi-minus"
                    size="large"
                    variant="outlined"
                    :disabled="!product.inStock || quantity <= 1"
                    @click="decrementQuantity"
                  />
                  <div class="quantity-display text-h5 font-weight-bold mx-4">
                    {{ quantity }}
                  </div>
                  <v-btn
                    icon="mdi-plus"
                    size="large"
                    variant="outlined"
                    :disabled="!product.inStock"
                    @click="incrementQuantity"
                  />
                </div>
              </div>

              <v-btn
                block
                size="x-large"
                color="earth"
                prepend-icon="mdi-cart-plus"
                :disabled="!product.inStock"
                @click="addToCart"
                class="add-to-cart-btn"
              >
                Legg i handlekurv
              </v-btn>

              <!-- Allergens -->
              <v-expansion-panels
                v-if="product.allergens?.length"
                class="allergens-expansion mt-4"
              >
                <v-expansion-panel elevation="0" class="allergens-panel">
                  <v-expansion-panel-title class="allergens-panel-title">
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-alert-circle-outline" class="mr-2" />
                      <span class="text-subtitle-1">Allergener</span>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <ul class="allergens-list">
                      <li
                        v-for="allergen in product.allergens"
                        :key="allergen._id"
                      >
                        {{ allergen.title }}
                      </li>
                    </ul>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-snackbar
                v-model="showSnackbar"
                :timeout="2000"
                color="success"
                location="top"
              >
                <v-icon icon="mdi-check-circle" class="mr-2" />
                {{ quantity }}
                {{ quantity === 1 ? "produkt" : "produkter" }} lagt til i
                handlekurven!
              </v-snackbar>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import Title from "~/components/Title.vue";
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

  // Quantity state
  const quantity = ref(1);
  const showSnackbar = ref(false);

  const incrementQuantity = () => {
    quantity.value++;
  };

  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };

  const addToCart = () => {
    // TODO: Implement cart functionality
    console.log(`Adding ${quantity.value} of ${product.value?.title} to cart`);
    showSnackbar.value = true;
    // Reset quantity after adding to cart
    setTimeout(() => {
      quantity.value = 1;
    }, 500);
  };
</script>

<style scoped lang="scss">
  .product-detail {
    .product-image-card {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

      :deep(.v-carousel__controls__item) {
        opacity: 1;
      }

      :deep(.v-btn.v-btn--icon) {
        background: rgba(255, 255, 255, 0.15) !important;
        backdrop-filter: blur(10px);
        color: white !important;
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        &:hover {
          background: rgba(255, 255, 255, 0.45) !important;
        }
      }
    }

    .product-info {
      padding: 0 16px;

      @media (min-width: 960px) {
        padding: 0 32px;
      }
    }

    .product-title {
      font-family: "Bree Serif", serif;
      color: #4d4738;
      line-height: 1.2;
    }

    .product-price {
      color: #755f4a;
    }

    .product-description {
      line-height: 1.7;
      color: rgba(0, 0, 0, 0.7);
    }

    .cart-section {
      padding: 24px;
      border-radius: 12px;

      h3 {
        font-family: "Bree Serif", serif;
        color: #4d4738;
      }

      .allergens-expansion {
        background: transparent;

        .allergens-panel {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 8px;
        }

        .allergens-panel-title {
          font-size: 0.9rem;
        }

        .allergens-list {
          margin: 0;
          padding-left: 40px;
          list-style-type: disc;

          li {
            padding: 4px 0;
            color: rgba(0, 0, 0, 0.87);
          }
        }
      }
    }

    .quantity-control {
      .quantity-display {
        min-width: 60px;
        text-align: center;
        color: #4d4738;
      }
    }

    .add-to-cart-btn {
      font-weight: 600;
      letter-spacing: 0.5px;
      border-radius: 9999px;
    }
  }

  .gap-2 {
    gap: 8px;
  }

  .gap-3 {
    gap: 12px;
  }

  .gap-4 {
    gap: 16px;
  }
</style>
