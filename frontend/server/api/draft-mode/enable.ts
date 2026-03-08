export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "No token provided",
    });
  }

  // Enable draft mode by setting a cookie with the token
  // Use secure: true for production (https), false for localhost (http)
  const isProduction = process.env.NODE_ENV === "production";

  setCookie(event, "__sanity_preview", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  // Redirect back to the provided URL or home
  const redirectUrl = (query.redirect as string) || "/";
  return sendRedirect(event, redirectUrl);
});
