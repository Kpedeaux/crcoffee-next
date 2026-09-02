// Cloudflare Pages Function
// Handles all /product/* requests from the legacy Square Online era.
//
// History: crcoffeenola.com was previously connected directly to Square Online,
// which served product pages under /product/<slug>. The site has since been
// rebuilt as a static marketing site and checkout lives at cr-coffee-shop.square.site.
// Those old product URLs no longer exist anywhere on this domain.
//
// Behavior:
//   /product or /product/       → 301 redirect to /order (human-friendly fallback)
//   /product/<anything-else>    → 410 Gone (tells Google to drop from the index)
//
// Why 410 and not 301-to-/order for deep URLs: redirecting 100+ distinct legacy
// URLs to a single destination is treated by Google as a soft-404 pattern and
// leaves them stuck in "Crawled - not indexed". A 410 is the correct permanent
// removal signal and causes Google to drop them from the crawl queue quickly.

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === '/product' || pathname === '/product/') {
    return Response.redirect(new URL('/order', url).toString(), 301);
  }

  return new Response(
    '<!doctype html><html><head><title>410 Gone</title></head><body><h1>410 Gone</h1><p>This page is no longer available. Visit <a href="/order">our order page</a> to purchase coffee.</p></body></html>',
    {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
