export default defineEventHandler(async (event) => {
  // Disable draft mode by deleting the cookie
  deleteCookie(event, "__sanity_preview", {
    path: "/",
  });

  // Redirect back to the provided URL or home
  const query = getQuery(event);
  const redirectUrl = (query.redirect as string) || "/";
  return sendRedirect(event, redirectUrl);
});
