<template>
  <v-container class="contact-container mx-auto px-4">
    <Title :title="'Kontakt oss'" color="#755f4a" />
    <p class="text-center mb-6">
      Har du spørsmål eller ønsker å komme i kontakt med oss? Fyll ut skjemaet
      nedenfor, så svarer vi så snart som mulig.
    </p>
    <v-form ref="form">
      <v-text-field
        class="mb-4 rounded-xl"
        v-model="contactInfo.name"
        placeholder="Navn"
        :rules="nameRules"
      />
      <v-text-field
        class="mb-4 rounded-xl"
        v-model="contactInfo.email"
        placeholder="E-post"
        :rules="emailRules"
      />
      <v-textarea
        class="mb-4 rounded-xl"
        v-model="contactInfo.message"
        placeholder="Skriv din melding her..."
        :rules="messageRules"
      />
      <div class="d-flex justify-center">
        <v-btn
          block
          color="earth"
          class="rounded-xl"
          @click="sendMessage"
          :loading="isLoading"
          :disabled="isLoading"
        >
          Send melding
        </v-btn>
      </div>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
  import Title from "./Title.vue";

  const form = useTemplateRef("form");
  const isLoading = ref(false);
  const successMessage = ref("");

  const contactInfo = reactive({
    name: "",
    email: "",
    message: "",
  });

  const nameRules = [
    (v: string) => !!v || "Navn er påkrevd",
    (v: string) => (v && v.length >= 2) || "Navn må være minst 2 tegn",
  ];

  const emailRules = [
    (v: string) => !!v || "E-post er påkrevd",
    (v: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Ugyldig e-postadresse",
  ];

  const messageRules = [(v: string) => !!v || "Melding er påkrevd"];

  const sendMessage = async () => {
    // Validate form
    const { valid } = (await form.value?.validate()) || { valid: false };
    if (!valid) {
      return;
    }

    isLoading.value = true;

    try {
      const response = await $fetch("/api/contact", {
        method: "POST",
        body: {
          name: contactInfo.name,
          email: contactInfo.email,
          message: contactInfo.message,
          subject: "Ny melding fra kontaktskjema",
        },
      });

      if (response.success) {
        successMessage.value =
          "Meldingen ble sendt! Vi svarer så snart som mulig.";
        // Reset form
        contactInfo.name = "";
        contactInfo.email = "";
        contactInfo.message = "";
        form.value?.reset();

        // Auto-remove success message after 4 seconds
        setTimeout(() => {
          successMessage.value = "";
        }, 4000);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert(
        error.data?.message ||
          "Det oppstod en feil ved sending av meldingen. Prøv igjen senere.",
      );
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  .contact-container {
    max-width: 600px;
  }

  @media (max-width: 600px) {
    .contact-container {
      max-width: 100%;
    }
  }

  .rounded-xl {
    border-radius: 24px !important;
  }

  .success-message {
    text-align: center;
    color: rgba(var(--v-theme-seafoam)) !important;
    margin-top: 16px;
    font-weight: 500;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
