# RETIRED (2026-09-02). This is not the CR Coffee site.

The rebuild developed here launched on crcoffeenola.com on 2026-09-02 and now lives in the
production repo **Kpedeaux/CRCoffee-site** (local folder `C:\Users\pedea\CoreRail\crcoffee-site`).
That repo is the only live one; everything below is history. Do not deploy, edit, or clone this
repo for site work. The Cloudflare Pages project `crcoffee-next` and the test.crcoffeenola.com
domain were retired the same day. The 4K hero footage and photo masters that were kept outside git
here were moved to `crcoffee-site/_internal/rebuild-masters/`.

---

# CR Coffee Shop — next site (beta)

From-scratch rebuild of crcoffeenola.com. **The live site at `CoreRail\crcoffee-site` is untouched and stays the deploy source for crcoffeenola.com until launch.**

## Status

- **LAUNCHED 2026-09-02.** This tree is what crcoffeenola.com serves (via the Kpedeaux/CRCoffee-site repo, see the launch section). The beta at test.crcoffeenola.com stays on the noindexed main branch here.
- Launch window: after Bayou Beast season ends (Nov 1, 2026), on Kevin's word.
- Bayou Beast season (added 2026-09-02, since launch now lands mid-season): homepage countdown section, /bayou-beast page, a Signature row on /drinks, an llms.txt line and an ai-agent.json promotion. One flag runs it: `BAYOU_BEAST_SEASON` in js/hero.js. Every `[data-beast]` block hides itself after Halloween 11:59 PM Central on its own. On Nov 1: flip the flag to false, bump the hero.js ?v= sitewide, remove the /drinks row and its MenuItem, drop the llms.txt line and the ai-agent.json promotion, and either past-tense /bayou-beast or 301 it to /drinks. Never the old drink name, never "unleash", never the trademark story.
- Crescent Room: intentionally dropped from this version (can be re-linked later if plans change).

## Beta guardrails (already baked in, remove only at launch)

While this site is in beta it must never be indexed:

1. Every page carries `<meta name="robots" content="noindex, nofollow">`.
2. `_headers` sends `X-Robots-Tag: noindex` on everything.
3. `robots.txt` is a blanket `Disallow: /`.
4. No `sitemap.xml` is submitted anywhere.

**Launch = one commit** that removes the noindex meta, the X-Robots-Tag line, and the robots.txt disallow together, and adds the sitemap. (The llms.txt / JSON-LD / ai-agent.json AI layer gets BUILT during beta, it just sits behind the noindex until then.)

## Viewing it

- Locally: open `index.html`, or run the preview server (see `.claude/launch.json` once added).
- On the web: deploy as a **separate Cloudflare Pages project** (suggested name `crcoffee-next`) with custom domain `test.crcoffeenola.com`. This keeps the production Pages project untouched. Optional: put Cloudflare Access in front of the test domain for a login gate.

## Hard content rules (inherited from the live site's history)

- Never tell the Bayou Beast trademark/name-change story, never use the old drink name, never use "unleash" phrasing, anywhere in copy. (Monster's lawyers trawl; two C&Ds already.)
- No food promotion. Coffee, drinks, beans, merch only. The croissant exists but is not marketed.
- Kevin's voice: no em dashes anywhere, one fact per item, no cleverness, staff framed as experts.

## Non-public files

`_internal/` is gitignored. Video source files, marketing drafts, and anything that shouldn't deploy lives there.

## At launch, don't forget

### Search and AI visibility (added 2026-09-02; full audit in `docs/seo-geo-audit-2026-09-02.md`)

The running list of off-site and launch-day work (listings, reviews, PR, Cloudflare, Search Console, GA4) is `docs/still-to-do.md`. Check items off there as they close.

- Replace `robots.txt` with `robots.production.txt` in the launch commit (current allowlist of search and answer-engine crawlers, sitemap and AI-Agent lines). `sitemap.xml` and `feed.xml` are generated files: regenerate after adding pages with `python scripts/sitemap.py` (and `python scripts/og-and-variants.py` for the og:image crop and hero variants of a new page; no priority/changefreq, lastmod only on articles).
- Verify the domain in Google Search Console and Bing Webmaster Tools the day of launch; submit the sitemap in both. Bing's IndexNow is free through Cloudflare (Crawler Hints, below). Never enable the GSC "exclude from generative AI" setting; it removes the site from AI Overviews and AI Mode.
- Cloudflare zone: turn ON Crawler Hints, Early Hints, and Speed Brain; leave Rocket Loader OFF (breaks the hero/nav script) and Polish/Mirage OFF (images are already sized and compressed here); set the AI bot controls to allow the Search and Agent categories (Training is Kevin's call, allowed by policy on his own sites).
- Deploy the forms Worker with the new origins before the contact page goes live: `cd CoreRail\corerail-forms && npm run deploy` (entries for crcoffeenola.com, www, and test.crcoffeenola.com are in `src/sites.js`).
- Google Business Profile: point every location's website field at its own page with UTM tags (`?utm_source=google&utm_medium=organic&utm_campaign=gbp`), confirm hours match the site, and create the MSY listing (it has none). Apple Business Connect, Bing Places, Yelp, and TripAdvisor get the same name, address, phone, and hours. Ask for Google reviews only; never solicit Yelp reviews.
- After launch, check the Bing Webmaster Tools "AI Performance" report and the GSC generative AI report monthly for which pages get cited.

- The /coffee film embed needs `frame-src https://www.youtube-nocookie.com` when the production CSP is added to `_headers` (the beta has no CSP). The CSP also needs `script-src https://www.googletagmanager.com` and `connect-src https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com` for the GA4/Ads tag (wired 2026-09-02, gated to the production hostnames in every page head; click and form events live in js/hero.js). The four location pages also embed Google Maps, so the same CSP needs `frame-src https://www.google.com` alongside it.
- Re-point Cloudflare zone/GSC as planned; `_redirects` here is already launch-ready (why-cr-coffee → about, press → news, Crescent Room paths → /crescent-room, drink pages → menu anchors).

- Swap the beta no-cache block in `_headers` for the production caching policy (see the comment in that file). The `?v=` version-tag discipline on css/js/video references is what makes the immutable policy safe.

- Redirect map: the old site's inbound URLs (news articles, blend pages, location pages, /order, /bayou-beast) must resolve on the new site or 301 to their replacements. Keep the `/product/*` and `/shop/*` 410 functions behavior.
- The Crescent Room is back on the site (2026-09-02): /crescent-room, a homepage section, and the old /events and /crescent-room-at-cr paths 301 there. Booking stays on coffeeshop.creativecorerail.com/book/cr.
- Reuse the existing GA4 property; verify timezone America/Chicago and 14-month retention.
- Re-point the production Cloudflare Pages project (or swap repos) per the deploy plan.
- GSC: submit new sitemap, watch coverage. Also Bing Webmaster Tools + IndexNow (ChatGPT rides Bing's index).
- Quality pass (per web-design skill principle 59): submit every form and confirm it arrives at its real destination; every page has a unique title + meta description; run `scripts/validate-schema.js` (once ported) with zero errors; confirm domain/redirect/regional config on Cloudflare; swap all interim absolute links (crcoffeenola.com/...) to relative paths; walk the whole site on an actual phone.
