<template>
  <v-footer class="footer-root">
    <div
      class="d-flex flex-column w-100"
      style="max-width: 2200px; margin: 0 auto"
    >
      <div class="footer-columns w-100">
        <v-col class="footer-col logo-col">
          <v-img
            src="/logo.png"
            alt="Fersk surdeigbrød"
            height="auto"
            width="80"
            max-height="100"
            contain
          />
        </v-col>
        <v-col class="footer-col">
          Produkter
          <v-list>
            <v-list-item-title>Bakevarer</v-list-item-title>
            <v-list-item-title>Trearbeid</v-list-item-title>
          </v-list>
        </v-col>
        <v-col class="footer-col">
          <v-list>
            Om oss
            <v-list-item-title>Vår historie</v-list-item-title>
            <v-list-item-title>Prosess</v-list-item-title>
          </v-list>
        </v-col>
        <v-col class="footer-col">
          Følg oss
          <v-list>
            <v-list-item-title
              ><a
                href="https://www.facebook.com/villheva"
                target="_blank"
                rel="noopener noreferrer"
                >Facebook</a
              ></v-list-item-title
            >
            <v-list-item-title
              ><a
                href="https://www.instagram.com/villheva"
                target="_blank"
                rel="noopener noreferrer"
                >Instagram</a
              ></v-list-item-title
            >
          </v-list>
        </v-col>
      </div>
      <v-divider class="w-100"></v-divider>
      <div class="d-flex justify-center py-4 w-100">© 2026 Villheva</div>
    </div>
  </v-footer>
</template>

<script setup lang="ts"></script>

<style scoped>
  .footer-root {
    padding: 1.5rem 1rem;
    background-color: oklch(0.98 0.005 75);
  }

  .footer-columns {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: flex-start;
    justify-content: space-between;
  }

  .footer-col {
    flex: 1 1 200px;
    min-width: 180px;
  }

  .logo-col {
    display: flex;
    justify-content: center;
  }
  .v-list {
    background-color: transparent;
  }
  @media (max-width: 600px) {
    .footer-columns {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }

    .footer-col {
      width: 100%;
      max-width: 320px;
      max-height: 120px;
    }

    .logo-col {
      order: -1;
    }

    .footer-root {
      padding: 1rem 0.75rem;
    }

    .footer-col :deep(.v-list) {
      padding: 0;
      margin-top: 0.25rem;
    }

    .footer-col :deep(.v-list-item-title) {
      font-size: 0.95rem;
      line-height: 1.2;
      padding: 0.125rem 0;
    }

    .footer-col {
      font-size: 1rem;
    }
  }
</style>
