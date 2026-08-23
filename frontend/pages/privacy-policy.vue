<template>
  <div class="privacy-policy-container">
    <div class="content-wrapper">
      <section class="privacy-section">
        <h1>Personvernserklæring</h1>

        <h2>Innsamling av personopplysninger</h2>
        <p>
          Vi samler kun inn følgende personopplysninger når du kontakter oss
          eller legger inn en bestilling:
        </p>
        <ul>
          <li>Navn</li>
          <li>E-postadresse</li>
          <li>Telefonnummer</li>
        </ul>

        <h2>Hvordan vi bruker dine opplysninger</h2>
        <p>Vi bruker disse opplysningene utelukkende til å:</p>
        <ul>
          <li>Behandle og bekrefte dine bestillinger</li>
          <li>Kommunisere med deg vedrørende dine bestillinger</li>
          <li>Svare på henvendelser fra deg</li>
        </ul>

        <h2>Lagring av data</h2>
        <p>
          Dine personopplysninger lagres utelukkende i vår bedriftsepostboks. Vi
          benytter ingen separate databaser eller lagringssystemer for kunde-
          eller kontaktinformasjon. Dette sikrer enkel og sikker håndtering av
          dine opplysninger.
        </p>

        <h2>Dine rettigheter</h2>
        <p>Du har rett til å:</p>
        <ul>
          <li>Få innsyn i dine personopplysninger</li>
          <li>Korrigere feil informasjon</li>
          <li>Be om at dine opplysninger slettes</li>
        </ul>
        <p>
          Ta kontakt med oss via e-post hvis du ønsker å utøve noen av disse
          rettighetene.
        </p>

        <h2>Kontakt oss</h2>
        <p>
          Hvis du har spørsmål om vår behandling av personopplysninger,
          vennligst kontakt oss via kontaktskjemaet på siden vår.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "default",
  });

  useSeo({
    title: "Personvernserklæring | Villheva",
    description:
      "Les vår personvernserklæring. Vi behandler kun nødvendige personopplysninger og lagrer de sikkert.",
  });
</script>

<style scoped>
  .privacy-policy-container {
    width: 100%;
    min-height: 100vh;
    background-color: oklch(0.98 0.005 75);
  }

  .content-wrapper {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 2rem;
  }

  .privacy-section {
    background-color: white;
    padding: 3rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    line-height: 1.8;
    color: #333;
  }

  .privacy-section h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #2c2c2c;
    border-bottom: 3px solid #755f4a;
    padding-bottom: 1rem;
  }

  .privacy-section h2 {
    font-size: 1.3rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #755f4a;
  }

  .privacy-section p {
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .privacy-section ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  .privacy-section li {
    margin-bottom: 0.5rem;
    list-style-type: disc;
  }

  @media (max-width: 768px) {
    .content-wrapper {
      padding: 2rem 1rem;
    }

    .privacy-section {
      padding: 1.5rem;
    }

    .privacy-section h1 {
      font-size: 1.5rem;
    }

    .privacy-section h2 {
      font-size: 1.1rem;
    }
  }
</style>
