<template>
  <v-footer
    style="
      background-color: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    "
  >
    <div class="d-flex flex-column w-100">
      <div class="d-flex align-center w-100">
        <v-col>
          <v-img
            src="/logo-proposal.png"
            alt="Fersk surdeigbrød"
            cover
            height="150"
            width="250"
          />
        </v-col>
        <v-col
          >Produkter
          <v-list>
            <v-list-item-title>Brød</v-list-item-title>
            <v-list-item-title>Kaker</v-list-item-title>
            <v-list-item-title>Småkaker</v-list-item-title>
          </v-list>
        </v-col>
        <v-col
          >Vår historie
          <v-list>
            <v-list-item-title>Om oss</v-list-item-title>
            <v-list-item-title>Prosess</v-list-item-title>
            <v-list-item-title>Kontakt</v-list-item-title>
          </v-list>
        </v-col>
        <v-col>
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
