<template>
  <v-footer class="footer-root">
    <div
      class="d-flex flex-column w-100"
      style="max-width: 2200px; margin: 0 auto"
    >
      <div class="footer-columns w-100">
        <v-col class="footer-col logo-col">
          <NuxtLink to="/">
            <v-img
              src="/logo.png"
              alt="Fersk surdeigbrød"
              height="auto"
              width="70"
              max-width="90"
              contain
            />
          </NuxtLink>
        </v-col>
        <v-col class="footer-col">
          Produkter
          <v-list>
            <v-list-item-title>
              <NuxtLink to="/products">Bakevarer</NuxtLink>
            </v-list-item-title>
            <v-list-item-title>
              <NuxtLink to="/products">Trearbeid</NuxtLink>
            </v-list-item-title>
          </v-list>
        </v-col>
        <v-col class="footer-col">
          <v-list>
            Om oss
            <v-list-item-title>
              <NuxtLink to="/about">Vår historie</NuxtLink>
            </v-list-item-title>
            <v-list-item-title>
              <NuxtLink to="/about">Prosess</NuxtLink>
            </v-list-item-title>
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
    justify-content: center;
  }

  .footer-col {
    flex: 1 1 160px;
    min-width: 140px;
  }

  .logo-col {
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    min-width: auto;
  }

  .logo-col a {
    text-decoration: none;
    display: flex;
  }

  .v-list {
    background-color: transparent;
  }

  .footer-col :deep(a) {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-col :deep(a:hover) {
    color: #755f4a;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .footer-columns {
      gap: 1rem;
      justify-content: center;
    }

    .footer-col {
      flex: 0 1 auto;
      min-width: 120px;
      max-width: 140px;
    }
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
      max-width: 100%;
      flex: 1 1 auto;
    }

    .logo-col {
      order: -1;
      width: 100%;
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
