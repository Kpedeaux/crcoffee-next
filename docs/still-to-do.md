# Still to do (off-site and launch-day), crcoffeenola.com rebuild

Kept current as items close. The in-code search-visibility work shipped 2026-09-02 (see
`seo-geo-audit-2026-09-02.md` for the evidence behind each item). Everything below is outside the
repo: listings, reviews, PR, Cloudflare, and measurement. Ordered by leverage, highest first.

## Listings (start now, no launch dependency)

- [ ] **Hours audit everywhere.** Site, Google Business Profile, Apple Business Connect, Yelp, Bing
      Places, Facebook. Same hours to the minute, holiday and Mardi Gras hours set ahead of time.
      "Open now" is a confirmed local ranking signal and padded hours hurt.
- [ ] **Google Business Profile website fields** for Magazine Street, St. Roch Market, and Old
      Metairie: point each at its own page with UTM tags once the site is live at crcoffeenola.com
      (`https://crcoffeenola.com/magazine-street?utm_source=google&utm_medium=organic&utm_campaign=gbp`,
      same pattern for `/st-roch-market` and `/old-metairie`).
- [ ] **GBP categories and attributes:** primary category exact on all three; Wi-Fi, outdoor seating,
      restrooms, wheelchair access, payment types filled in; no campaign or seasonal names in the
      profile name (Bayou Beast stays out of listing names and schema).
- [ ] **St. Roch stall naming:** confirm the stall's profile reads "CR Coffee Shop" with "located in
      St. Roch Market," distinct from the market's own venue profile.
- [ ] **MSY kiosk listing:** blocked. Kevin cannot create a Business Profile for the airport kiosk (the
      concession controls it). Fallback: ask the concessionaire to list CR Coffee in the flymsy.com
      dining directory with a link to `/msy-airport`, and keep the kiosk described on the site.
- [ ] **Apple Business Connect:** claim all place cards (three shops), match name, address, phone, hours.
- [ ] **Bing Places:** import from GBP and turn on the scheduled sync.
- [ ] **Yelp and TripAdvisor:** complete every field, add current photos, reply to reviews. Never ask
      customers for Yelp reviews.
- [ ] **Facebook page:** address and hours match the site.
- [ ] **Square:** turn on the Google product listings sync and the Square ChatGPT app for the bean bags.

## Reviews and PR

- [ ] **Google-only review program:** QR code at each counter, staff prompt at handoff, steady trickle
      rather than bursts, owner reply within a day in a human voice. Staff incentives only, never
      customer incentives. Guide reviewers toward what they ordered and how it was.
- [ ] **Best-of list placement** (the top AI-visibility factor): Eater New Orleans, The Infatuation,
      Gambit Best of New Orleans, NOLA.com, Yelp collections, r/AskNOLA and r/NewOrleans threads.
      Pitch the airport kiosk to travel press separately.
- [ ] **strochmarket.com link:** the CR vendor page links to `/st-roch-market` and back.
- [ ] **Outsider cold-read:** one person outside the business reads the homepage cold and answers what
      is this, who is it for, what do I do next. Rewrite anything they miss.
- [ ] **Ad landing pages:** list the live Google Ads campaigns so each gets a one-audience, one-action
      landing page instead of the homepage.

## Launch day (the commit that removes noindex)

- [ ] Replace `robots.txt` with `robots.production.txt`; remove the noindex meta tags and the
      `X-Robots-Tag` header; swap the beta no-cache `_headers` block for the production cache policy;
      add the CSP with `frame-src` for Google Maps and youtube-nocookie.
- [ ] Cloudflare zone: Crawler Hints on, Early Hints on, Speed Brain on, Rocket Loader off, Polish and
      Mirage off, managed robots.txt off; bot settings allow the Search and Agent categories; AI Crawl
      Control shows every citation bot allowed; curl the custom domain with each bot user agent and
      confirm 200. Never enable Pay Per Crawl or `Content-Signal: ai-input=no`.
- [ ] Google Search Console: verify the domain, submit `sitemap.xml`, confirm the generative-AI
      exclusion setting is off.
- [ ] Bing Webmaster Tools: verify, submit the sitemap, set the IndexNow key, open the AI Performance
      report.
- [ ] GA4: reuse the existing property, timezone America/Chicago, 14-month retention, an AI-referral
      channel group (chatgpt.com, perplexity.ai, claude.ai, gemini.google.com, copilot.microsoft.com),
      events for order-ahead, shop, directions, call, and signup clicks.
- [ ] Old-site redirects verified live: news articles, blend pages, location pages, `/order`,
      `/bayou-beast`, Crescent Room paths.

## After launch

- [ ] Monthly prompt audit: the same 8 to 10 questions in ChatGPT, Perplexity, Google AI Mode, Gemini,
      Claude, and Copilot; log who gets named and which URLs are cited; that list is the PR target list.
- [ ] Monthly: Bing AI Performance report and the Search Console generative AI report.
- [ ] Optimize one change at a time, above the fold first: H1, then hero image, then CTA copy, then proof
      placement, each measured for a week.
- [ ] Add testimonials or a customer video the week they arrive; they were not held for launch.
