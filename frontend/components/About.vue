<template>
  <section class="w-100 h-100 d-flex">
    <v-col class="w-50 d-flex align-center justify-end mr-12">
      <v-img
        src="/hero-sourdough.png"
        alt="Fersk surdeigbrød"
        class="hero-image rounded-xl"
        cover
      />
    </v-col>
    <v-col class="w-50 d-flex align-center justify-start">
      <div style="max-width: 30rem">
        <h1 class="hero-title">Laget fra hjertet av vårt hjem</h1>
        <p class="mb-4">
          Velkommen til Villheva, der tradisjon møter håndverk. Vi er et lite
          familiedrevet mikrobakeri som driver fra vårt hjem, dedikert til å
          lage håndverks surdeig ved bruk av tradisjonsrike teknikker.
        </p>
        <p class="mb-4">
          Hvert brød er håndformet med omsorg, får fermentere naturlig, og bakes
          til gyllen perfeksjon. Vår surdeig starter har blitt pleiet i årevis,
          og gir brødet vårt sin distinkte smak og tekstur.
        </p>
        <p>
          Utover brød, lager vi vakre trefat og smørkniver fra lokalt
          skandinavisk tre. Hvert stykke er unikt, formet for hånd, og
          ferdigstilt med mattrygge oljer for å bringe varme til bordet ditt.
        </p>
      </div>
    </v-col>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
  .hero-image {
    width: 100%;
    max-width: 50%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .hero-title {
    margin-bottom: 1.5rem;
    font-family: serif;
    font-weight: 400;
    font-size: 2.25rem;
    line-height: 2.75rem;
    color: #4d4738;
    text-wrap: balance;
  }

  @media (min-width: 640px) {
    .hero-title {
      font-size: 3rem;
      line-height: 1.1;
    }
  }
</style>
