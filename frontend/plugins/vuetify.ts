import { defineNuxtPlugin } from "#app";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: "#4d4738",
            secondary: "#BAB9A7",
            accent: "#755f4a",
            olive: "#4d4738",
            seafoam: "#BAB9A7",
            earth: "#755f4a",
            oak: "#c0ae94",
          },
        },
      },
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
