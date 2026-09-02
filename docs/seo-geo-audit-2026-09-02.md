# SEO + GEO audit and plan, crcoffee-next (2026-09-02)

Four research tracks (technical SEO, GEO/AI search, local multi-location SEO, structured data), each run
against primary sources dated 2025-2026, then mapped onto a full audit of this repo and the deployed test
site. Evidence tiers: **[A]** documented by Google/Bing/OpenAI/Anthropic/Perplexity/Apple/Cloudflare,
**[B]** credible independent data with disclosed samples, **[C]** practitioner consensus, **[D]** vendor hype.

## 1. The three things that changed the plan

1. **For "best coffee in New Orleans" answers, the AI engines mostly are not reading the website.** [A/B]
   Google AI Mode cites Google Maps/GBP for ~80% of local answers; ChatGPT builds its local business cards
   from Yelp in 96% of runs (Yelp licensed its reviews to OpenAI on 2026-07-23); Perplexity uses Yelp and
   TripAdvisor partnerships; Gemini and Ask Maps ground on Maps data. Restaurants: GBP 45%, Yelp 22%,
   TripAdvisor 7%, OpenTable 7%, Facebook 3% of AI citations (BrightLocal, 1.9M citations, Aug 2026).
   The site's job is narrower than we assumed: be crawlable by every citation bot, hold the facts in plain
   HTML near the top of focused pages, and match the listings character for character.
2. **Google now says so directly.** Its "Optimizing for generative AI features" guide (May 2026, updated
   July): no special files or markup; llms.txt and AI text files "neither harm nor help" because Google
   ignores them; for local businesses "use Google Business Profile." FAQ rich results were removed for
   everyone on 2026-05-07. Ahrefs (1,885 pages) measured no meaningful citation lift from adding JSON-LD.
3. **Crawler access is the one hard gate, and it is fragile.** [A] OAI-SearchBot opt-out = "will not be
   shown in ChatGPT search"; PerplexityBot and Claude-SearchBot likewise; Cloudflare's Sept 15 2026
   defaults add Search/Agent/Training categories and its own docs warn a Training block can catch
   Googlebot/Bingbot. `noarchive` removes you from Copilot citations entirely. One toggle can silently end
   AI visibility.

## 2. Research findings that matter for this site

### Confirmed by the platforms [A]
- Core Web Vitals unchanged: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at p75; no new metric in 2025-26.
  CrUX field data needs traffic; a site this size gets origin-level data at best, so lab numbers are the proxy.
- Google reads `og:image` and `og:title`/`og:site_name` for its own thumbnails, title links and site name;
  `WebSite` schema on the homepage sets the site name; `max-image-preview:large` + 1200px 16:9 images
  are the Discover eligibility bar for articles.
- Sitemap: `priority` and `changefreq` are ignored; `lastmod` only if verifiably accurate (Illyes: wrong
  dates are worse than none). IndexNow: Bing/Yandex/Naver/Seznam/Amazon, not Google; Bing tells owners
  to use it so "AI systems reference the most current version." Cloudflare Crawler Hints does IndexNow
  automatically and free.
- Cloudflare Pages: Early Hints are auto-generated from `<link rel=preload>` EXCEPT links carrying
  `fetchpriority` or `crossorigin` (our hero poster preload carries fetchpriority, so it is not hinted);
  a missing root `404.html` puts Pages in SPA mode (we have one; real 404s verified).
- LocalBusiness: `geo` needs >= 5 decimal places; `priceRange` < 100 chars; `menu` URL; specific subtype
  (`CafeOrCoffeeShop`); self-serving `aggregateRating`/`review` remain banned (review-snippet doc, Jul 2026).
- Organization (doc Apr 2026): logo >= 112px crawlable, address, telephone, email, contactPoint, `sameAs`
  to social AND review sites; `naics`, `iso6523Code` (DUNS) for disambiguation; org-level
  `hasMerchantReturnPolicy`. Full node on the homepage, compact nodes elsewhere.
- Product: merchant listings need on-page purchase; ours link to Square, so Product snippets (price,
  availability) are the ceiling. Offer-level `shippingDetails`/returns are merchant-listing features and
  do nothing here. Square's Google listings sync + Square's ChatGPT app (2026-07-01) are the levers for
  Shopping/AI product answers.
- Article: `author` needs `url`/`sameAs`; dates ISO 8601 with timezone; images >= 1200px in 16:9/4:3/1:1.
- E-E-A-T is not a ranking factor (starter guide); the documented signals are visible bylines linking to
  a bio, first-hand material, and disclosure of AI assistance where used.
- Openness ("open at time of search") is a confirmed local ranking signal; Google removed public GBP
  Q&A (Dec 2025); Ask Maps launched Mar 2026 over Maps data; AI local packs on mobile show 1-2 slots.
- Bing Webmaster Tools AI Performance report (Feb/Jun 2026) is the only first-party per-page AI citation
  data; Search Console's Generative AI report (Jun 2026) gives impressions only; a Search Console setting
  can now EXCLUDE a site from AI Overviews/AI Mode (never flip it).

### Credible independent data [B]
- Citation drivers: relevance + retrieval position dominate (252,000 paired trials; Google #1 pages cited
  3.5x more than outside top 20). Explicit prices and recent timestamps help. 44% of ChatGPT citations
  come from the first 30% of a page. Title/query overlap >= 50% doubles citation rate. Focused pages beat
  mega-guides. Formatting-only edits and "GEO tricks" are null-to-negative in competitive replication.
- Local visibility gate: AI-recommended locations average 4.3 stars; profile accuracy ~68% on
  ChatGPT/Perplexity vs 100% on Gemini; reviews act as a filter, not a ranking (SOCi, 350k locations).
  Review count has a threshold (~10) then plateaus; recency beats volume (Sterling Sky tests).
- llms.txt: 97% of published files get zero requests; AI retrieval bots made "a couple of hundred fetches"
  across thousands of sites (Ahrefs, 137k domains). Harmless, unproven.
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Meta, Bytespider) do not execute JavaScript; Applebot
  and Google do. Static HTML is the right architecture; nothing here is JS-injected.
- Whitespark 2026 local ranking factors: local pack = GBP category, proximity, ratings, open-now, review
  recency/velocity, NAP match; local organic = dedicated page per service, geo-relevant content, links,
  landing-page titles/headings; AI visibility = best-of lists, service pages, unstructured citations
  (news, blogs), third-party review sites.
- Consumers (BrightLocal 2026, n=1,002): 68% require 4 stars, 74% want reviews from the last 3 months,
  89% expect owner replies, 45% used AI tools to find local businesses (6% a year earlier).

### Hype to ignore [D]
"FAQ schema = 3x citations", "question headings +180%", "tables 4.2x", Perplexity factor weights,
"Foursquare feeds 70% of ChatGPT local" (0% in a 4,607-prompt test), keyword density, title-length
penalties, "AI-friendly schema", buying brand mentions, chunking content for LLMs, a fabricated
"June 2026 rater guidelines update." Bing now names engineered citation bait and prompt-injection text as
abuse; Google's spam policies cover AI-answer manipulation (May 2026).

## 3. Site audit (this repo + test.crcoffeenola.com)

### Strong already
- Full `CafeOrCoffeeShop` per location (address, geo, hours, amenities, menu link, OrderAction,
  parentOrganization, Maps sameAs); Product + Offer on 5 blend pages; BlogPosting + Breadcrumb on all 25
  articles; Menu schema; VideoObject; AboutPage with two Person nodes; validator 0 errors across 46 pages.
- Unique titles on every page; one h1 per page; alt attributes on every image; zero broken links;
  no JS-rendered content; text-wrap balance on headings; 25 hover states; 11 reduced-motion gates.
- llms.txt served as text/plain; `.well-known/ai-agent.json` as application/json; HSTS, nosniff,
  frame-deny, referrer, permissions headers live; `.html` 308s to extensionless; real 404s.
- NAP consistent per location across pages, llms.txt and ai-agent.json; social handles consistent
  (instagram/tiktok crcoffeeshop, facebook CRCoffeeShop, youtube coffeewithkevin).
- Lighthouse mobile, homepage: performance 88, LCP 3.4s, CLS 0, TBT 100ms.

### Gaps (in-code)
1. No `rel=canonical` on any page (Google: strong signal; must be absolute, self-referencing, extensionless).
2. No Open Graph / Twitter tags on any page (Google uses og:image/og:title; social + AI link previews).
3. No `WebSite` schema on the homepage; Organization is a thin stub (no logo, address, telephone,
   contactPoint, founder; sameAs lacks Maps/Yelp/TripAdvisor). Article authors lack `url`/`sameAs`.
4. Geo coordinates at 4-5 decimals (Google asks for >= 5). `hasMap` absent. Stall and kiosk lack
   `containedInPlace`. Articles lack `max-image-preview:large`.
5. Performance: no responsive `srcset`, so phones download 1920px heroes; Magazine page LCP 10.5s on
   mobile (485KB band webp, 235KB hero, jpg-only gallery images); Google Maps iframe pulls ~90KB of
   script on each location page; the 188x200 logo displayed at 34x34 trips Lighthouse's aspect check;
   no webp for news cards / several gallery images.
6. Missing at launch: sitemap.xml (drop priority/changefreq; truthful lastmod or none), production
   robots.txt naming the search bots, manifest.json + apple-touch-icon (live site has both), feed.xml
   (live site had one), IndexNow via Crawler Hints, cache policy swap (documented), CSP (documented).
7. Conversion-side from the existing checklist: /drinks, /wholesale, /rewards CTAs have no proof line
   beside them; wholesale has no inquiry form (mailto only); no contact page at all; newsletter signup
   is a click-out to a Square page rather than an inline field; privacy and accessibility pages end
   without a closer.
8. Several titles > 70 chars and descriptions > 200 chars on news pages (display truncation only).

### Gaps (off-site, higher leverage than any of the above)
9. MSY kiosk has no Google Business Profile. St. Roch stall GBP naming/category discipline vs the
   St. Roch Market venue profile needs a check. GBP website fields should point to each location page
   with UTM tags (verify current values).
10. Apple Business (rebranded Apr 2026), Bing Places (import from GBP + sync), Yelp and TripAdvisor
    completeness for all four; Facebook page address/hours.
11. Review program: Google only (never solicit Yelp reviews; Yelp penalizes and now feeds ChatGPT),
    staff-prompted, steady trickle, reply within a day in a human voice.
12. Best-of list placement is the #1 AI-visibility factor: Eater NOLA, The Infatuation, Gambit Best Of,
    NOLA.com, Yelp collections, r/AskNOLA threads; pitch the airport kiosk to travel press.
13. Cross-property link: strochmarket.com's CR vendor page -> /st-roch-market.

## 4. Recommended actions, ranked (evidence x effort)

### A. In-code, before launch (all cheap, all [A])
A1. Canonical + Open Graph + Twitter card on all 46 pages (per-page og:image, 1200x630 crop of each hero).
A2. Homepage `WebSite` + full `Organization` (logo, address, phone, email, contactPoint, foundingDate,
    founder, sameAs incl. GBP Maps URLs + Yelp + TripAdvisor + press, naics 722515 pending confirmation);
    compact org node elsewhere; org-level return policy; drop offer-level shippingDetails.
A3. Location schema: geo to 6 decimals, `hasMap`, `containedInPlace` for St. Roch stall and MSY kiosk,
    sameAs per location (Maps, Yelp, Apple). Article schema: author url -> /about#kevin + sameAs;
    `max-image-preview:large`.
A4. Production robots.txt: allow Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot,
    Perplexity-User, Claude-SearchBot, Claude-User, Google-Extended, Applebot, DuckAssistBot,
    Amzn-SearchBot; training bots (GPTBot, ClaudeBot, CCBot, Bytespider, Meta-ExternalAgent,
    Applebot-Extended) = Kevin's policy call (he allows them). Retire the obsolete tokens
    `anthropic-ai` and `Claude-Web`. Sitemap line.
A5. sitemap.xml (46 URLs, extensionless, no priority/changefreq, lastmod only where truthful);
    feed.xml regenerated; manifest.json + apple-touch-icon carried over; favicon >= 48px PNG.
A6. Performance: responsive srcset (960/1440/1920) for heroes and bands; recompress the outliers
    (streetside band, coldbrew-ice); webp for remaining jpg-only images; logo object-fit; manual
    `Link:` Early Hint for the hero poster; Maps iframe -> static map facade that loads the iframe on click.
A7. FAQ: keep the visible Q&A blocks (Bing lifts them into answers); FAQPage JSON-LD is now zero-value
    for Google, harmless if it mirrors text. Recommend freeze, no new ones.
A8. Answer-first openers on location pages ("CR Coffee Shop Magazine Street is a coffee shop at 3618
    Magazine St in Uptown New Orleans, open daily 6am to 7pm, with a patio..."), question-form h2s,
    a visible "Updated Month YYYY" line; titles that mirror the spoken query.
A9. Dedicated pages that win their own answers: /chicory-coffee (what it is, St. Roch Blend, price, buy),
    catering, private events, gift cards/subscriptions (dedicated service pages = #1 local-organic factor).
A10. A contact page (form via the CoreRail forms Worker, email, per-location phones and hours) and a
    wholesale inquiry form with a "what happens next" line; inline email capture in the footer.

### B. Cloudflare zone (launch day)
B1. Security > Bots: confirm AI-bot blocking does not catch Search or Agent categories; AI Crawl Control
    shows every citation bot Allowed; Bot Fight Mode not challenging them; curl the CUSTOM domain with
    each UA and confirm 200 (community reports of Pages custom-domain 403s).
B2. Crawler Hints on (free IndexNow); Rocket Loader off; Speed Brain on; managed robots.txt off.
B3. Never enable Pay Per Crawl; never set `Content-Signal: ai-input=no`.

### C. Off-site (start now, no launch dependency)
C1. Hours audit everywhere (GBP, site, Apple, Yelp, Bing, Facebook) including holidays/Mardi Gras;
    "open now" is a ranking signal.
C2. Create/claim the MSY GBP (name "CR Coffee Shop", airport address + concourse line, Located in,
    own phone, real hours, kiosk photos, website = /msy-airport); flymsy.com directory entry.
C3. GBP website field -> location page + UTM on all profiles; categories audit; attributes complete
    (Wi-Fi, outdoor seating, restrooms, wheelchair, payments); Services editor if exposed.
C4. Apple Business: claim all four place cards. Bing Places: import + scheduled sync. Yelp + TripAdvisor:
    complete, respond, never solicit. Facebook address/hours.
C5. Google-only review program with QR at the counter; staff incentives, never customer incentives;
    guide reviewers toward outcome-specific wording.
C6. Best-of list and press placement; Reddit participation as the owner; strochmarket.com link.
C7. Enable Square's Google product listings sync and Square's ChatGPT app for the bean bags.

### D. Measurement (launch week)
D1. Search Console: sitemap, Generative AI report, confirm the AI exclusion setting is OFF.
D2. Bing Webmaster Tools: verify, sitemap, IndexNow key, AI Performance report (Local intent).
D3. GA4 at launch with an AI-referral channel (chatgpt.com, perplexity.ai, claude.ai, gemini.google.com,
    copilot.microsoft.com); events for order-ahead, shop, directions, and signup clicks; note num=100
    removal reset impressions baselines in Sept 2025. Benchmarks: homepage bounce > 80% is a flag,
    2-3% site conversion is decent, landing pages 10%+.
D4. Monthly prompt audit: the same 8-10 questions across ChatGPT, Perplexity, AI Mode, Gemini, Claude,
    Copilot; log who gets named and which URLs are cited. That list is the PR target list.

### E. Do not
Keyword-stuff, add engineered citation bait, write mega-guides, mark up self-serving ratings, solicit
Yelp reviews, put campaign names (Bayou Beast) into GBP names or schema `name`, pad hours, block
search/agent bots, add FAQPage/HowTo/SearchAction expecting rich results, or treat llms.txt as a lever.

## 5. Sam Crawford transcript audit (39 videos vs the web-design skill vs this build)

Two agents read all 39 transcripts (113k words) against crawford-principles.md and SKILL.md.

### Practices in neither the skill nor the CR rebuild (candidate site actions)
- **Proof inside every hero, not just the homepage.** Sam's 2026 hero recipe has five parts (headline,
  sub-line, one CTA, visual, proof in the CTA's eyeline). CR's homepage has the press line; the inner
  page heroes (coffee, drinks, locations, wholesale) carry none.
- **The outsider cold-read.** Nobody outside the business has read the homepage cold and answered
  what/who/what-next. Cheap, and Sam calls it the single most useful copy test.
- **Contact anatomy.** "A website that hides its contact details loses jobs." CR has no contact page and
  no forms; wholesale is a bare mailto. (Overlaps A10.)
- **Landing pages for paid traffic.** Ads should never land on the homepage; the CR Google Ads campaigns
  need dedicated one-audience, one-action pages.
- **A competitor H1 pass.** Read the top three competitors' heroes (French Truck, Mammoth, Cherry, PJ's)
  before finalizing ours; never copy, but know the gap.
- **A specific guarantee near the bean CTA** ("roasted the week it ships, or we make it right") instead
  of a generic promise.
- **Inline email capture** in the footer rather than a click-out button (needs the forms Worker).
- **Route the B2B audience.** Wholesale is footer-only on desktop; give it a deliberate entry point.
- **Post-launch optimization discipline.** One deliberate change at a time, above the fold first
  (H1, then hero image, then CTA copy, then proof placement), with GA4 measuring it.
- **Favicon in light and dark variants.**

### Practices new to the skill that the rebuild already satisfies
Persistent header CTA; scrim over hero text; nav under seven items with a burger CTA in thumb reach;
homepage FAQ accordion; spacing tokens and one section padding; two-tier button system; verb-plus-object
CTA labels; brand equity kept through the redesign; thought-leadership in the nav (News, Coffee With
Kevin); real logo assessed; hero-standalone test passes (you can order from the first screen);
mining existing photo assets before shooting new ones.

### Skill updates proposed (all gated on Kevin's review)
Add: hero five-part recipe; spacing/alignment system; button hierarchy; CTA label ladder; the
five-question critique protocol with hand-cover and count-three tests; squint / eye-walk /
hero-standalone checks; nav discipline specifics; default running order + page-job map + "what you get
and when" timeline; landing-page rule; value equation + specific guarantee; competitor pass; guided
testimonial requests; reading reference sites by experience; benchmarks (bounce, conversion, 1s = 7%);
density counter-lever; high-ticket funnels to a call; launch without testimonials; owner-editability +
recorded handover for client sites; be-the-only-option copy stance (reconciled with Kevin's warmth);
refresh equity, never reinvent; never clone a competitor; outsider copy test; route audiences; logo as
foundation; site as brand standard; bento grids; background rhythm; phased launch; annotated feedback.
Soften: carousel ban (manual peek rows allowed for secondary lists); stock photo absolutism; "cut copy
in half" (context that answers questions gets added); palette 3-5 as ceiling not target; eyebrow rule
(a consistent styled device is fine, the reflexive AI kicker is the tell); AI verdict (AI may build from
a human design); Plus Jakarta wording; copy-first vs placeholder reconciliation; video hero conditional.
Fix: TOC housekeeping in crawford-principles.md.

## 6. Sources
Google Search Central: ai-optimization-guide, ai-features, structured-data/organization,
local-business, article, product-snippet, merchant-listing, site-names, sitemaps/build-sitemap,
consolidate-duplicate-urls, google-images, favicon-in-search, spam-policies, updates changelog;
web.dev optimize-lcp/cls/inp; developers.cloudflare.com pages/early-hints, bots/block-ai-bots,
cache/crawler-hints; blog.cloudflare.com content-independence-day-ai-options (2026-07-01);
developers.openai.com/api/docs/bots; docs.perplexity.ai/guides/bots; support.claude.com/8896518;
Bing Webmaster guidelines (Feb 2026) and AI Performance posts (Feb/Jun 2026); Whitespark LSRF 2026;
Sterling Sky tests; BrightLocal consumer survey 2026 + AI directory sources (Aug 2026); SOCi LVI 2026;
Ahrefs llms.txt study (Jun 2026) and schema-citation test (May 2026); AirOps fan-out study;
Vishwakarma et al. 2026 (252k trials); C-SEO Bench (NeurIPS 2025); Steady Demand (Aug 2026);
Axios/Yelp-OpenAI (2026-07-23); Apple newsroom Apple Business (2026-03-24); Sam Crawford YouTube
transcripts (39 videos, 2023-2026) in CoreRail\YouTubeTranscripts.
