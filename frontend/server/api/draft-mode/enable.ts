import { createClient } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";

/**
 * Entry point for Sanity's Presentation tool.
 *
 * The Studio opens this URL with a one-time `sanity-preview-secret` query
 * parameter (plus `sanity-preview-pathname`), NOT a raw token. The secret is
 * validated against the `sanity.previewUrlSecret` document in the dataset,
 * which requires a server-side token with viewer rights.
 *
 * On success we store the read token in a cookie so `useSanity()` can query the
 * `drafts` perspective. That token is readable by the browser by design --
 * visual editing needs to fetch drafts client-side -- so it must be a
 * *read-only* token, and it is only handed out after the secret checks out.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const readToken = config.sanityReadToken as string;

  if (!readToken) {
    console.error(
      "[Draft Mode] SANITY_API_READ_TOKEN is not configured; preview cannot be enabled.",
    );
    throw createError({
      statusCode: 500,
      message: "Preview is not configured on this deployment",
    });
  }

  const client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    // validatePreviewUrl needs an API version that knows about preview secrets.
    apiVersion: "2025-02-19",
    useCdn: false,
    token: readToken,
  });

  let isValid = false;
  let redirectTo = "/";
  try {
    ({ isValid, redirectTo = "/" } = await validatePreviewUrl(
      client,
      getRequestURL(event).toString(),
    ));
  } catch (error: any) {
    // Most often a bad or expired SANITY_API_READ_TOKEN, which otherwise
    // surfaces as an opaque 500.
    console.error("[Draft Mode] Could not validate preview secret:", error?.message);
    throw createError({
      statusCode: 500,
      message: "Could not validate preview secret -- check SANITY_API_READ_TOKEN",
    });
  }

  if (!isValid) {
    throw createError({ statusCode: 401, message: "Invalid preview secret" });
  }

  // sameSite "none" + secure are required for the Studio's cross-origin iframe.
  setCookie(event, "__sanity_preview", readToken, {
    httpOnly: false,
    sameSite: "none",
    secure: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return sendRedirect(event, redirectTo);
});
