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

- Swap the beta no-cache block in `_headers` for the production caching policy (see the comment in that file). The `?v=` version-tag discipline on css/js/video references is what makes the immutable policy safe.

- Redirect map: the old site's inbound URLs (news articles, blend pages, location pages, /order, /bayou-beast) must resolve on the new site or 301 to their replacements. Keep the `/product/*` and `/shop/*` 410 functions behavior.
- Crescent Room URLs need a decision (redirect to homepage or a farewell note).
- Reuse the existing GA4 property; verify timezone America/Chicago and 14-month retention.
- Re-point the production Cloudflare Pages project (or swap repos) per the deploy plan.
- GSC: submit new sitemap, watch coverage.
