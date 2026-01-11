export default defineNuxtRouteMiddleware((to) => {
  // Only redirect non-root paths to their section on the homepage
  if (to.path === "/") return;

  const section = to.path.replace(/\/+$/, "").replace(/^\/+/, "");
  if (!section) return;

  const sectionHash = `#${section.charAt(0).toUpperCase()}${section.slice(1)}`;
  return navigateTo({ path: "/", hash: sectionHash, query: to.query });
});
