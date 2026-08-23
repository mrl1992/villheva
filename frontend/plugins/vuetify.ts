import { defineNuxtPlugin } from "#app";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    // Required for SSR/prerender: makes useDisplay() resolve to SSR-safe
    // defaults and update after mount instead of mismatching on hydration.
    ssr: true,
    defaults: {
      VTextField: {
        variant: "outlined",
        density: "compact",
        hideDetails: "auto",
        class: "rounded-xl",
      },
      VTextarea: {
        variant: "outlined",
        density: "compact",
        hideDetails: "auto",
      },
    },
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
