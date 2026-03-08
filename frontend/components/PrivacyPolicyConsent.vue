<template>
  <v-snackbar
    v-model="showSnackbar"
    location="bottom"
    :timeout="-1"
    class="consent-snackbar"
  >
    <div class="consent-content">
      <p class="mb-3">
        Vi samler kun inn nødvendige personopplysninger for å kunne behandle din
        henvendelse. Ved å klikke "Jeg godtar" gir du ditt samtykke til at vi
        kan behandle dine opplysninger i henhold til vår
        <NuxtLink to="/privacy-policy" target="_blank" class="privacy-link">
          personvernserklæring
        </NuxtLink>
      </p>
      <div class="consent-actions">
        <v-btn
          size="small"
          variant="outlined"
          color="earth"
          @click="handleDisagree"
        >
          Avvis
        </v-btn>
        <v-btn size="small" color="earth" @click="handleAgree">
          Jeg godtar
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
  const showSnackbar = ref(false);

  const CONSENT_KEY = "villheva_privacy_consent";

  const checkConsent = () => {
    if (process.client) {
      const hasConsented = localStorage.getItem(CONSENT_KEY);
      showSnackbar.value = !hasConsented;
    }
  };

  const handleAgree = () => {
    if (process.client) {
      localStorage.setItem(CONSENT_KEY, "accepted");
    }
    showSnackbar.value = false;
    emit("consent-given");
  };

  const handleDisagree = () => {
    if (process.client) {
      localStorage.setItem(CONSENT_KEY, "declined");
    }
    showSnackbar.value = false;
    emit("consent-declined");
  };

  const resetConsent = () => {
    if (process.client) {
      localStorage.removeItem(CONSENT_KEY);
      showSnackbar.value = true;
    }
  };

  const emit = defineEmits<{
    "consent-given": [];
    "consent-declined": [];
  }>();

  onMounted(() => {
    checkConsent();
  });

  defineExpose({
    resetConsent,
    checkConsent,
  });
</script>

<style scoped>
  .consent-snackbar {
    padding: 1rem !important;
  }

  :deep(.v-snackbar__content) {
    background-color: oklch(0.96 0.01 70);
    border-radius: 8px;
  }

  .consent-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .consent-content p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
    color: #555;
  }

  .privacy-link {
    color: #755f4a;
    text-decoration: none;
    font-weight: 600;
  }

  .privacy-link:hover {
    text-decoration: underline;
  }

  .consent-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  @media (max-width: 600px) {
    .consent-content {
      gap: 0.5rem;
    }

    .consent-actions {
      justify-content: space-between;
      gap: 0.5rem;
    }

    .consent-content p {
      font-size: 0.85rem;
    }
  }
</style>
