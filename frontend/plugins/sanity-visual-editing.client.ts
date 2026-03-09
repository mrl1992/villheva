import { enableVisualEditing } from "@sanity/visual-editing";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  try {
    const isInIframe = window.self !== window.top;
    
    // Always enable visual editing when in an iframe (Presentation Tool)
    if (!isInIframe) {
      console.log("[Visual Editing] Not in iframe, skipping");
      return;
    }

    console.log("[Visual Editing] Enabling visual editing for Presentation Tool...");

    // Enable visual editing with proper configuration
    enableVisualEditing({
      zIndex: 999999,
    });

    console.log("[Visual Editing] Enabled successfully");
  } catch (error) {
    console.error("[Visual Editing] Error during setup:", error);
  }
});
