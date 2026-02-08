import { enableVisualEditing } from "@sanity/visual-editing";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  try {
    const previewCookie = useCookie("__sanity_preview");
    const isDraftMode = !!previewCookie.value;
    const isInIframe = window.self !== window.top;

    const shouldEnable = isDraftMode || isInIframe;

    if (!shouldEnable) {
      console.log("[Visual Editing] Not enabled");
      return;
    }

    console.log("[Visual Editing] Enabling...");

    // Simple enablement without complex history handling
    const cleanup = enableVisualEditing({
      zIndex: 999999,
    });

    console.log("[Visual Editing] Enabled successfully");

    // Clean up on app unmount
    if (nuxtApp) {
      nuxtApp.hook("app:unmounted", () => {
        if (cleanup && typeof cleanup === "function") {
          cleanup();
        }
      });
    }
  } catch (error) {
    console.error("[Visual Editing] Error:", error);
  }
});
