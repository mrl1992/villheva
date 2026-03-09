export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "No token provided",
    });
  }

  // Always use secure settings for iframe compatibility
  // sameSite: "none" is required for cross-origin iframes (Presentation Tool)
  setCookie(event, "__sanity_preview", token, {
    httpOnly: false, // Must be false for client-side access
    sameSite: "none", // Required for iframe usage
    secure: true, // Required when sameSite is "none"
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  console.log("[Draft Mode] Enabled with token");

  // Redirect back to the provided URL or home
  const redirectUrl = (query.redirect as string) || "/";
  return sendRedirect(event, redirectUrl);
});
