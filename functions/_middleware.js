// Cloudflare Pages Middleware
// Runs before every request, including route-specific functions.
//
// Purpose: 301-redirect the production pages.dev alias to the canonical
// crcoffeenola.com domain. Cloudflare Pages auto-creates a *.pages.dev URL
// for every project and there is no way to disable it, so without this
// middleware Google (and any other crawler) can index the pages.dev copy
// and create duplicate-content competition with the canonical .com.
//
// Scope: Only redirects the production alias `crcoffee-site.pages.dev`.
// Per-deployment preview URLs (`<hash>.crcoffee-site.pages.dev` and
// `<branch>.crcoffee-site.pages.dev`) are intentionally left alone so they
// remain usable for pre-production testing.
//
// www.crcoffeenola.com → crcoffeenola.com is handled at the Cloudflare zone
// level by a Redirect Rule and does not need to be duplicated here.

const CANONICAL_HOST = 'crcoffeenola.com';
const PAGES_DEV_PRODUCTION_HOSTS = ['crcoffee-site.pages.dev', 'crcoffee-next.pages.dev'];

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Repo housekeeping that ships with the static tree but is not part of the site.
  if (url.pathname.startsWith('/docs/') || url.pathname.startsWith('/scripts/') || url.pathname === '/README.md') {
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
  }

  if (PAGES_DEV_PRODUCTION_HOSTS.includes(url.hostname)) {
    const canonical = new URL(
      url.pathname + url.search,
      `https://${CANONICAL_HOST}`
    );
    return Response.redirect(canonical.toString(), 301);
  }

  return next();
}
