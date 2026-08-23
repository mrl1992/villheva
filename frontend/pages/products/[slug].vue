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
                  :alt="`${product?.title} - bakevare fra Villheva`"
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
              :alt="`${product.title} - bakevare fra Villheva`"
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
        <v-col cols="12" md="6" class="product-info-column">
          <div class="product-info-layout">
            <div class="product-info">
              <Title style="justify-content: start" :title="product.title" />

              <!-- Price and Stock -->
              <div class="d-flex align-center gap-3 mb-6">
                <p class="product-price text-headline-large font-weight-bold mb-0">
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
                class="text-body-large text-medium-emphasis mb-4"
              >
                <v-icon icon="mdi-weight" size="small" class="mr-1" />
                {{ product.weight }}g
              </p>

              <!-- Description -->
              <p
                v-if="product.description"
                class="text-body-large mb-6 product-description"
              >
                {{ product.description }}
              </p>

              <v-divider class="my-6" />
            </div>
            <div class="product-bottom">
              <!-- Quantity Counter & Add to Cart -->
              <div class="cart-section">
                <div class="cart-actions">
                  <div class="quantity-pill">
                    <button
                      type="button"
                      class="quantity-pill__button"
                      :disabled="!product.inStock || quantity <= 1"
                      @click="decrementQuantity"
                      aria-label="Reduser antall"
                    >
                      <v-icon icon="mdi-minus" size="16" />
                    </button>
                    <span class="quantity-pill__value">{{ quantity }}</span>
                    <button
                      type="button"
                      class="quantity-pill__button"
                      :disabled="!product.inStock"
                      @click="incrementQuantity"
                      aria-label="Øk antall"
                    >
                      <v-icon icon="mdi-plus" size="16" />
                    </button>
                  </div>

                  <v-btn
                    size="x-large"
                    color="earth"
                    prepend-icon="mdi-cart-plus"
                    :disabled="!product.inStock"
                    @click="addToCart"
                    class="add-to-cart-btn"
                  >
                    Legg i handlekurv
                  </v-btn>
                </div>
              </div>

              <v-expansion-panels
                v-if="product.allergens?.length"
                class="allergens-expansion mt-4"
              >
                <v-expansion-panel elevation="0" class="allergens-panel">
                  <v-expansion-panel-title class="allergens-panel-title">
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-alert-circle-outline" class="mr-2" />
                      <span class="text-body-large">Allergener</span>
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
  const cartStore = useCartStore();
  const config = useRuntimeConfig();

  const {
    data: product,
    error,
    pending,
  } = await useAsyncData(
    `product-${slug}`,
    () => sanityService.getProductBySlug(slug),
    { watch: [() => route.params.slug] },
  );

  // SEO - Update meta tags when product loads
  watch(
    product,
    (newProduct) => {
      if (newProduct) {
        useSeo({
          title: newProduct.title,
          description:
            newProduct.description || `Kjøp ${newProduct.title} på Villheva`,
          image: newProduct.imageUrls?.[0],
          url: `${config.public.siteUrl}/products/${newProduct.slug}`,
          type: "product",
        });

        // Add structured data for product
        useStructuredData(
          createProductSchema(newProduct, config.public.siteUrl),
        );

        // Breadcrumb structured data
        useStructuredData(
          createBreadcrumbSchema(
            [
              { name: "Hjem", url: config.public.siteUrl },
              { name: "Produkter", url: `${config.public.siteUrl}/products` },
              {
                name: newProduct.title,
                url: `${config.public.siteUrl}/products/${newProduct.slug}`,
              },
            ],
            config.public.siteUrl,
          ),
        );
      }
    },
    { immediate: true },
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
    if (product.value) {
      for (let i = 0; i < quantity.value; i++) {
        cartStore.addToCart(product.value);
      }
      console.log(`Added ${quantity.value} of ${product.value.title} to cart`);
      showSnackbar.value = true;
      // Reset quantity after adding to cart
      setTimeout(() => {
        quantity.value = 1;
      }, 500);
    }
  };
</script>

<style scoped lang="scss">
  .product-detail {
    .product-info-column {
      display: flex;
      flex-direction: column;
    }

    .product-info-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .product-bottom {
      margin-top: auto;
    }

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
      display: flex;
      flex-direction: column;
      gap: 16px;

      .cart-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
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

      .quantity-pill {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #ffffff;
        border-radius: 9999px;
        padding: 8px 16px;
        border: 1px solid rgba(192, 174, 148, 0.5);
      }

      .quantity-pill__button {
        padding: 4px;
        color: #4d4738;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover:not(:disabled) {
          color: #755f4a;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .quantity-pill__value {
        width: 32px;
        text-align: center;
        font-weight: 600;
        color: #4d4738;
      }
    }

    .add-to-cart-btn {
      font-weight: 600;
      letter-spacing: 0.5px;
      border-radius: 9999px;
      flex: 1 1 220px;
      min-width: 200px;
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
