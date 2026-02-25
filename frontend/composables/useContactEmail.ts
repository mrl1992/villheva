import { ref, readonly } from "vue";

export const useContactEmail = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  const sendContactEmail = async (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await $fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      success.value = true;
      return response;
    } catch (err: any) {
      error.value = err.data?.message || err.message || "Failed to send email";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    success: readonly(success),
    sendContactEmail,
  };
};
