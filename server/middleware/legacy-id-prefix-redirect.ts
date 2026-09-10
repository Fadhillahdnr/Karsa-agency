/**
 * Indonesian used to be the `/id/**`-prefixed locale (English at the bare
 * path). Now that `id` is the default locale (bare path) and `en` is
 * prefixed, every previously-indexed/bookmarked `/id/...` URL would 404 —
 * this 301s it to the same path without the prefix, which now serves the
 * same Indonesian content. English URLs at the old bare path aren't
 * redirected here: they now serve Indonesian by design (the swap itself),
 * mitigated by the existing hreflang alternates pointing search engines at
 * the new `/en/...` location.
 */
export default defineEventHandler((event) => {
  const { pathname, search } = getRequestURL(event)
  if (pathname !== '/id' && !pathname.startsWith('/id/')) return

  const target = pathname.slice('/id'.length) || '/'
  return sendRedirect(event, target + search, 301)
})
