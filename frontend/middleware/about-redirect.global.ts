export default defineNuxtRouteMiddleware((to) => {
  // Don't redirect if it's the root path
  if (to.path === "/") return;

  // Don't redirect if the path has a hash already (it's a section link)
  if (to.hash) return;

  // List of actual routes that should not be redirected
  const actualRoutes = [
    "/products",
    "/gallery",
    "/about",
    "/cart",
    "/checkout",
    "/privacy-policy",
  ];

  // Check if the path is an actual route
  const isActualRoute = actualRoutes.some(
    (route) => to.path === route || to.path.startsWith(route + "/"),
  );

  // If it's an actual route, don't redirect
  if (isActualRoute) return;

  // For other paths, try to redirect to homepage with section hash
  const section = to.path.replace(/\/+$/, "").replace(/^\/+/, "");
  if (!section) return;

  const sectionHash = `#${section}`;
  return navigateTo({ path: "/", hash: sectionHash, query: to.query });
});
