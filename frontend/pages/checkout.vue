<template>
  <div class="checkout-container">
    <div class="section-container">
      <h1 class="checkout-title">Bestilling</h1>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <p>Kurven er tom</p>
        <NuxtLink to="/products" class="back-link">Gå til produkter</NuxtLink>
      </div>

      <div v-else class="checkout-content">
        <!-- Order Summary -->
        <div class="order-summary">
          <h2 class="section-heading">Ordresammendrag</h2>
          <div class="order-items">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="order-item"
            >
              <div class="item-details">
                <span class="item-name">{{ item.title }}</span>
                <span class="item-qty">x{{ item.quantity }}</span>
              </div>
              <span class="item-price"
                >{{ item.price * item.quantity }} kr</span
              >
            </div>
          </div>
          <div class="order-divider"></div>
          <div class="order-total">
            <span class="total-label">Totalt:</span>
            <span class="total-amount">{{ cartStore.cartTotal }} kr</span>
          </div>
        </div>

        <!-- Customer Information Form -->
        <div class="checkout-form">
          <h2 class="section-heading">Kundeoplysninger</h2>

          <div class="form-group">
            <label for="name">Navn *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Ditt navn"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">E-post *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="din@epost.no"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Telefon *</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="12345678"
              required
            />
          </div>

          <div class="form-group">
            <label for="notes">Spesielle instruksjoner (valgfritt)</label>
            <textarea
              id="notes"
              v-model="formData.notes"
              placeholder="Noen spesielle ønsker eller instruksjoner?"
              rows="3"
            />
          </div>

          <div class="privacy-consent-box">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="privacyConsent"
                class="checkbox-input"
              />
              <span class="checkbox-text">
                Jeg godtar at mine opplysninger behandles i henhold til
                <NuxtLink
                  to="/privacy-policy"
                  target="_blank"
                  class="privacy-link"
                >
                  personvernserklæringen
                </NuxtLink>
                *
              </span>
            </label>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <NuxtLink to="/products" class="cancel-btn"
              >Fortsett shopping</NuxtLink
            >
            <button
              class="submit-btn"
              @click="submitOrder"
              :disabled="isLoading || !privacyConsent"
            >
              {{ isLoading ? "Sender bestilling..." : "Fullfør bestilling" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessMessage"
      color="success"
      location="top"
      :timeout="5000"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="mr-2" />
        <span
          >Bestilling sendt! Takk for din ordre. Sjekk e-posten din for
          kvittering.</span
        >
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccessMessage = false"> Lukk </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
  const cartStore = useCartStore();

  // Transactional page: no SEO value and the cart is empty at build time.
  useHead({
    title: "Kasse | Villheva",
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  });

  const formData = ref({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const isLoading = ref(false);
  const errorMessage = ref("");
  const showSuccessMessage = ref(false);
  const privacyConsent = ref(false);

  // Check if user has already consented
  onMounted(() => {
    if (process.client) {
      const consent = localStorage.getItem("villheva_privacy_consent");
      if (consent === "accepted") {
        privacyConsent.value = true;
      }
    }
  });

  const submitOrder = async () => {
    // Reset messages
    errorMessage.value = "";

    // Check privacy consent
    if (!privacyConsent.value) {
      errorMessage.value =
        "Du må godta personvernserklæringen for å legge inn en bestilling.";
      return;
    }

    // Store consent if accepted
    if (process.client && privacyConsent.value) {
      localStorage.setItem("villheva_privacy_consent", "accepted");
    }

    // Validate form
    if (
      !formData.value.name ||
      !formData.value.email ||
      !formData.value.phone
    ) {
      errorMessage.value = "Vennligst fyll ut alle obligatoriske felt";
      return;
    }

    isLoading.value = true;

    try {
      const response = await $fetch("/api/order", {
        method: "POST",
        body: {
          items: cartStore.items,
          total: cartStore.cartTotal,
          customer: formData.value,
        },
      });

      if (response.success) {
        // Clear cart and show success message
        cartStore.clearCart();
        showSuccessMessage.value = true;

        // Navigate to home after a short delay
        setTimeout(() => {
          navigateTo("/");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Order submission error:", error);
      errorMessage.value =
        error.data?.message ||
        error.message ||
        "En feil oppstod under behandling av bestillingen. Vennligst prøv igjen.";
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style scoped>
  .checkout-container {
    min-height: 100vh;
    padding: 100px 1.5rem 2rem;
    background-color: oklch(0.96 0.01 70);
  }

  .section-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .checkout-title {
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    color: #4d4738;
    margin-bottom: 2rem;
    text-align: center;
  }

  .empty-cart {
    text-align: center;
    padding: 3rem 1rem;
  }

  .empty-cart p {
    font-size: 1.1rem;
    color: #4d4738;
    margin-bottom: 1.5rem;
  }

  .back-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #c0ae94;
    color: #4d4738;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .back-link:hover {
    background-color: #b39a7f;
  }

  .checkout-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
  }

  .order-summary {
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: sticky;
    top: 100px;
  }

  .section-heading {
    font-family: "Playfair Display", serif;
    font-size: 1.25rem;
    color: #4d4738;
    margin-bottom: 1rem;
    margin-top: 0;
  }

  .order-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.75rem;
  }

  .item-details {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }

  .item-name {
    font-weight: 500;
    color: #4d4738;
  }

  .item-qty {
    color: #999;
  }

  .item-price {
    font-weight: 600;
    color: #755f4a;
  }

  .order-divider {
    border-top: 1px solid #eee;
    margin: 1rem 0;
  }

  .order-total {
    display: flex;
    justify-content: space-between;
    padding-top: 0.75rem;
  }

  .total-label {
    font-weight: 600;
    color: #4d4738;
  }

  .total-amount {
    font-weight: 700;
    font-size: 1.25rem;
    color: #755f4a;
  }

  .checkout-form {
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group label {
    font-weight: 500;
    color: #4d4738;
    font-size: 0.95rem;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-family: inherit;
    font-size: 1rem;
    color: #4d4738;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #c0ae94;
    box-shadow: 0 0 0 3px rgba(192, 174, 148, 0.1);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .payment-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .payment-option:hover {
    background-color: #f9f9f9;
  }

  .payment-option input[type="radio"] {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .cancel-btn {
    flex: 1;
    padding: 0.875rem;
    background-color: #c0ae94;
    color: #4d4738;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    text-align: center;
    transition: background-color 0.2s;
    border: none;
    cursor: pointer;
  }

  .cancel-btn:hover {
    background-color: #b39a7f;
  }

  .submit-btn {
    flex: 1;
    padding: 0.875rem;
    background-color: #755f4a;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-btn:hover {
    background-color: #634d3c;
  }

  .submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .privacy-consent-box {
    background-color: #f8f7f6;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e5e3e0;
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    gap: 0.75rem;
  }

  .checkbox-input {
    margin-top: 3px;
    cursor: pointer;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .checkbox-text {
    font-size: 0.95rem;
    line-height: 1.5;
    color: #444;
  }

  .privacy-link {
    color: #755f4a;
    text-decoration: none;
    font-weight: 600;
  }

  .privacy-link:hover {
    text-decoration: underline;
  }

  .error-message {
    padding: 12px 15px;
    background-color: #fee;
    border: 1px solid #fcc;
    border-radius: 0.5rem;
    color: #c33;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    .checkout-container {
      padding-top: 80px;
    }

    .checkout-content {
      grid-template-columns: 1fr;
    }

    .order-summary {
      position: static;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }

    .section-heading {
      margin-top: 1.5rem;
    }

    .section-heading:first-of-type {
      margin-top: 0;
    }
  }
</style>
