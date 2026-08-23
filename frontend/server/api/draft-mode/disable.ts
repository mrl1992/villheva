import { urlSearchParamPreviewPathname } from "@sanity/preview-url-secret";

export default defineEventHandler(async (event) => {
  deleteCookie(event, "__sanity_preview", { path: "/" });

  const query = getQuery(event);
  const redirectUrl =
    (query[urlSearchParamPreviewPathname] as string) ||
    (query.redirect as string) ||
    "/";

  return sendRedirect(event, redirectUrl);
});
