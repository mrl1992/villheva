import { enableVisualEditing } from "@sanity/visual-editing";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Enable visual editing to establish connection with Sanity Studio
    enableVisualEditing({
      zIndex: 999999,
    });
  }
});
