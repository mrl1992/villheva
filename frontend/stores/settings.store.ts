import { defineStore } from "pinia";
import type { SiteSettings } from "~/models/site-settings.interface";
import { sanityService } from "~/services/sanityService";

export const useSettingsStore = defineStore("settings", () => {
  const siteSettings = ref<SiteSettings | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSiteSettings() {
    loading.value = true;
    error.value = null;
    try {
      siteSettings.value = await sanityService.getSiteSettings();
      console.log("🚀 ~ siteSettings:", siteSettings.value);
    } catch (err: any) {
      error.value = err.message;
      console.error("Failed to fetch site settings:", err);
    } finally {
      loading.value = false;
    }
  }

  return {
    siteSettings,
    loading,
    error,
    fetchSiteSettings,
  };
});
