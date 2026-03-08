export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "No token provided",
    });
  }

  // Determine if production
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  // Set the preview cookie with proper configuration
  setCookie(event, "__sanity_preview", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  console.log("[Draft Mode] Enabled with token");

  // Redirect back to the provided URL or home
  const redirectUrl = (query.redirect as string) || "/";
  return sendRedirect(event, redirectUrl);
});
