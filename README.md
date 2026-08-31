# CR Coffee Shop — next site (beta)

From-scratch rebuild of crcoffeenola.com. **The live site at `CoreRail\crcoffee-site` is untouched and stays the deploy source for crcoffeenola.com until launch.**

## Status

- **BETA. Not launched. Do not point crcoffeenola.com here.**
- Launch window: after Bayou Beast season ends (Nov 1, 2026), on Kevin's word.
- Branding: post-season CR Coffee. No Bayou Beast takeover machinery in this codebase.
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

- The /coffee film embed needs `frame-src https://www.youtube-nocookie.com` when the production CSP is added to `_headers` (the beta has no CSP).
- Re-point Cloudflare zone/GSC as planned; `_redirects` here is already launch-ready (why-cr-coffee → about, press → news, Crescent Room paths → magazine-street, drink pages → menu anchors).
- OPEN QUESTION for Kevin: `/bayou-beast` currently 301s to /drinks; if the Beast returns in 2027, resurrect a landing page at that path instead.

- Swap the beta no-cache block in `_headers` for the production caching policy (see the comment in that file). The `?v=` version-tag discipline on css/js/video references is what makes the immutable policy safe.

- Redirect map: the old site's inbound URLs (news articles, blend pages, location pages, /order, /bayou-beast) must resolve on the new site or 301 to their replacements. Keep the `/product/*` and `/shop/*` 410 functions behavior.
- Crescent Room URLs need a decision (redirect to homepage or a farewell note).
- Reuse the existing GA4 property; verify timezone America/Chicago and 14-month retention.
- Re-point the production Cloudflare Pages project (or swap repos) per the deploy plan.
- GSC: submit new sitemap, watch coverage. Also Bing Webmaster Tools + IndexNow (ChatGPT rides Bing's index).
- Quality pass (per web-design skill principle 59): submit every form and confirm it arrives at its real destination; every page has a unique title + meta description; run `scripts/validate-schema.js` (once ported) with zero errors; confirm domain/redirect/regional config on Cloudflare; swap all interim absolute links (crcoffeenola.com/...) to relative paths; walk the whole site on an actual phone.
