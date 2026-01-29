<template>
  <v-container class="contact-container mx-auto px-4">
    <h1 class="text-center hero-title">Kontakt oss</h1>
    <p class="text-center mb-6">
      Har du spørsmål eller ønsker å komme i kontakt med oss? Fyll ut skjemaet
      nedenfor, så svarer vi så snart som mulig.
    </p>
    <v-form ref="form">
      <v-text-field
        class="mb-4 rounded-xl"
        v-model="contactInfo.name"
        placeholder="Navn"
      />
      <v-text-field
        class="mb-4 rounded-xl"
        v-model="contactInfo.email"
        placeholder="E-post"
      />
      <v-textarea
        class="mb-4 rounded-xl"
        v-model="contactInfo.message"
        placeholder="Skriv din melding her..."
      />
      <div class="d-flex justify-center">
        <v-btn block color="earth" class="rounded-xl">Send melding</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
  const form = useTemplateRef("form");

  const contactInfo = reactive({
    name: "",
    email: "",
    message: "",
  });
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
</style>
