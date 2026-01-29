import { enableVisualEditing } from "@sanity/visual-editing";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const previewCookie = useCookie("__sanity_preview");
    const isDraftMode = !!previewCookie.value;

    // Only enable visual editing in development or draft mode
    if (import.meta.dev || isDraftMode) {
      enableVisualEditing({
        zIndex: 999999,
      });
    }
  }
});
