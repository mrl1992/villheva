import { enableVisualEditing } from "@sanity/visual-editing";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  try {
    const isInIframe = window.self !== window.top;
    let isDraftMode = false;

    // Safely read cookie - may fail in sandboxed iframes
    try {
      const previewCookie = useCookie("__sanity_preview");
      isDraftMode = !!previewCookie.value;
    } catch (e) {
      // Cookie access failed (likely sandboxed iframe)
      isDraftMode = false;
    }

    const shouldEnable = isDraftMode || isInIframe;

    if (!shouldEnable) {
      console.log("[Visual Editing] Not enabled - not in draft mode or iframe");
      return;
    }

    console.log("[Visual Editing] Enabling visual editing...");

    // Enable visual editing with proper configuration
    enableVisualEditing({
      zIndex: 999999,
    });

    console.log("[Visual Editing] Enabled successfully");
  } catch (error) {
    console.error("[Visual Editing] Error during setup:", error);
  }
});
