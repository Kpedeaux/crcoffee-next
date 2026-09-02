// Cloudflare Pages Function
// Handles all /shop/* requests from the legacy Square Online era.
//
// History: crcoffeenola.com was previously connected directly to Square Online,
// which served shop/category pages under /shop/<slug>. The site has since been
// rebuilt as a static marketing site and checkout lives at cr-coffee-shop.square.site.
// Those old shop URLs no longer exist anywhere on this domain.
//
// Behavior:
//   /shop or /shop/             → 301 redirect to /order (human-friendly fallback)
//   /shop/<anything-else>       → 410 Gone (tells Google to drop from the index)

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === '/shop' || pathname === '/shop/') {
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
