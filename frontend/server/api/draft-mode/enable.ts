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
  // For localhost we avoid secure/none so the cookie works over http
  setCookie(event, "__sanity_preview", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  // Redirect back to the provided URL or home
  const redirectUrl = (query.redirect as string) || "/";
  return sendRedirect(event, redirectUrl);
});
