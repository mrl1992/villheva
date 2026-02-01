export default defineNuxtRouteMiddleware((to, from) => {
  // This middleware ensures draft mode token is available to the client
  // The token is set via the __sanity_preview cookie by /api/draft-mode/enable
  const previewCookie = useCookie("__sanity_preview");

  // If there's a draft mode cookie, it's already set by the API endpoint
  // This middleware just ensures the cookie is accessible throughout the route navigation
  if (previewCookie.value) {
    // Token is present, visual editing should work
    return;
  }
});
