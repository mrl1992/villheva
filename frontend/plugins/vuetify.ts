import { defineNuxtPlugin } from "#app";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    // Required for SSR/prerender: makes useDisplay() resolve to SSR-safe
    // defaults and update after mount instead of mismatching on hydration.
    ssr: true,
    theme: {
      // Vuetify 4 changed this default to "system". Only the light theme below
      // defines the brand colours, so under a dark system preference every
      // colour prop (earth, oak, olive, seafoam) resolved to nothing and the
      // buttons fell back to native browser styling.
      defaultTheme: "light",
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
    display: {
      // Vuetify 4 lowered the breakpoints (md 960->840). Keep the v3 values
      // the responsive timeline on the about page was built against.
      thresholds: { md: 960, lg: 1280, xl: 1920, xxl: 2560 },
    },
    defaults: {
      VBtn: {
        // Vuetify 4 dropped the uppercase text-transform default on buttons.
        class: "text-uppercase",
      },
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
  });
  nuxtApp.vueApp.use(vuetify);
});
