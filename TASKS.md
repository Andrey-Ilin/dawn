# SwaySculpt Dawn — Migration Tasks

Working checklist of remaining work for the Dawn redesign per `SPEC.md`.
Audit reference: localhost `http://127.0.0.1:9292/`, production `https://swaysculpt.com/`, design reference `https://www.runnersathletics.com/`.

Legend: `[ ]` open · `[~]` partial · `[x]` done · `BUG` = broken on localhost now.

---

## A. Bugs / regressions on localhost (fix first)

- [x] **BUG: Featured collection cards render nearly invisible** on `/` — root cause: Dawn's `animations_reveal_on_scroll` setting wrapped each card `<li>` in `scroll-trigger animate--slide-in`, which sets `opacity: 0.01` until IntersectionObserver fires. Fixed by setting `animations_reveal_on_scroll: false` in `config/settings_data.json`.
- [x] **BUG: Hero headline unreadable** — converted `sections/image-banner.liquid` heading from `<h2>` to `<h1>` and updated `.banner__heading` in `assets/base.css` to Playfair Display 700, white (#fff), 72px cap, with text-shadow over the existing dark scrim.
- [x] **BUG: Process strip is empty visually** — resolved by disabling `animations_reveal_on_scroll`. The columns had `scroll-trigger animate--slide-in` classes that held them at `opacity: 0.01`. Colors were already correct (light on `#0F0F0F`).
- [x] **BUG: Newsletter section appears empty** — root cause: prior custom CSS targeted `#shopify-section-newsletter` ID, which doesn't match the homepage's template-scoped section. Switched selectors to `.newsletter__wrapper`, kept coral bg from `color-scheme-5`, set subhead/heading/button to full white opacity for contrast on coral.
- [x] **BUG: Footer has duplicated menus** — removed the `footer-1` "Info" link_list block (which pointed at the same `footer` menu as `footer-0` "Quick links") from `sections/footer-group.json`.
- [x] **BUG: Footer has placeholder text** — removed the `footer-2` text block ("Our mission" + placeholder paragraph) from `sections/footer-group.json`.
- [x] **BUG: Footer has duplicate newsletter** — set `newsletter_enable: false` in `sections/footer-group.json` so the footer no longer renders the duplicate signup form (homepage section 7 still has it).
- [x] **BUG: "Follow on Shop" Shopify button** — set `enable_follow_on_shop: false` in `sections/footer-group.json`.
- [x] **BUG: Product page leftover sections** — removed `image-with-text` and `multicolumn` (Free Shipping / Hassle-Free Exchanges placeholder) sections from `templates/product.json` (and from `order`).
- [x] **BUG: Product page shows vendor "PRINTIFY"** — removed the `vendor` text block from `templates/product.json` (blocks + block_order).
- [x] **BUG: Console 404 for `/favicon.ico`** — added `assets/favicon.svg` (dark square + gold "S" mark) and a fallback `<link rel="icon">` in `layout/theme.liquid` for when `settings.favicon` is unset.
- [ ] Console: `Framing 'https://shop.app/' violates CSP` — informational from Shop Pay iframe; ignore.

---

## B. Phase 1 — Foundation

- [x] Google Fonts (`Playfair Display` 700 + `Inter` 400/500/600/700) preloaded in `layout/theme.liquid:17`.
- [x] `--font-heading-family` / `--font-body-family` set in `layout/theme.liquid:235-237`.
- [x] `--color-*` tokens verified in `config/settings_data.json` color_schemes:
  - `#F8F6F1` Off-White → scheme-1 background ✓
  - `#0F0F0F` Near-Black → scheme-1 text, scheme-3/4 background ✓
  - `#E8A020` Accent Gold → schemes 1-4 button ✓
  - `#D4533A` Accent Red → scheme-5 background (used by newsletter) ✓
  - `#FFFFFF` White → scheme-2 background (`card_color_scheme: scheme-2`) ✓
  - `#9096A8` Mid-Grey → not a literal scheme token; functionally covered by Dawn's `rgba(var(--color-foreground), 0.75)` muted-caption pattern
- [x] Buttons: `border-radius: 4px` (from `buttons_radius: 4` setting), flat (no `background_gradient` in any scheme), and 2px solid border for `.button--secondary` (added override in `assets/base.css` setting `--buttons-border-width: 2px`).
- [x] Buttons: primary CTA uses Accent Gold bg + Near-Black text — replaced the outline-style override in `assets/base.css` with filled-gold + near-black text + uppercase, on hover inverts to dark fill + light text.
- [x] Header: switched `.header-wrapper` bg to `#F8F6F1` Off-White, link color to `#0F0F0F` Near-Black, kept Artist Gold for active/hover. Removed dropdown light-on-dark inversion (no longer needed). Logo filter flipped to `brightness(0)` until proper dark SVG is uploaded.
- [x] Header: dark logo via CSS `filter: brightness(0)` on `.header__heading-logo` so the existing white feather PNG renders solid black on the Off-White header. Long-term: upload a brand-correct dark SVG via Shopify admin → Settings → Logo (tracked under §I "Assets needed").
- [ ] Header nav: replace `Home / Catalog / Contact / FAQ` with `Shop ▾` mega/dropdown of `Men / Women / Kids / Accessories` (configure in Shopify admin → Navigation → main-menu).

---

## C. Phase 2 — Homepage (`templates/index.json`)

Section order target: announcement-bar → image-banner → category-tiles (multicolumn) → featured-collection → process-strip (multicolumn) → second-collection → newsletter → footer.

- [x] Announcement bar copy: `Free Shipping to US & Canada • Art-inspired wearable prints`. Verify bg `#0F0F0F` / text `#E8A020` (currently appears black/white).
- [ ] Hero image-banner:
  - [ ] `min-height: 90vh` desktop / `70vh` mobile (currently shorter)
  - [ ] H1, Playfair Display 72px, white
  - [ ] Subhead `Original wearable art prints` (already present)
  - [ ] CTA `Shop Now` → `/collections/all`, Accent Gold bg, Near-Black text
  - [ ] Replace placeholder lifestyle photo (woman + brick) with brand hero per asset list §13, or use solid `#0F0F0F` bg with centered text fallback
- [ ] Category tiles (4 cols): square images + bottom semi-transparent dark label strip + `scale(1.02)` hover. Currently labels overlay but image quality/size needs review.
- [ ] Featured collection ("The Collection"):
  - [ ] Sort by best sellers (`collection: all`)
  - [ ] Max 8 products
  - [ ] Card spec: image top, name, price — **remove `Choose options` / `Add to cart` quick-add button** (spec §4.4)
  - [ ] Fix transparent-card bug listed in section A
- [ ] Process strip (3-col multicolumn):
  - [ ] Remove the heading "How it's made" (spec doesn't have a section title here) OR keep if desired — confirm with stakeholder
  - [ ] Bg `#0F0F0F`, text white/Accent Gold
  - [ ] Copy already correct: Designed Here / Crafted to Order / Shipped to You
- [ ] Second collection row "New Arrivals": same card spec, sort by `created-descending`. **Currently missing from `templates/index.json`.**
- [ ] Newsletter section: bg `#D4533A`, headline `Get early access to new drops`, subhead `New prints and exclusive releases delivered to your inbox.` (copy already there — fix contrast).
- [ ] Footer: clean two-column (Quick links left, store info right), Instagram + TikTok icons, copyright `© 2025 SwaySculpt.`, Dawn native `payment-terms` block. Remove duplicate menus, "Our mission" placeholder, and Shop button (see section A).

---

## D. Phase 3 — Product page (`templates/product.json`)

- [ ] Add **Size guide** link directly above size variant selector → `/pages/size-guide`.
- [ ] Add **`Ships in 5–10 business days`** badge below Add to Cart (use a product-description block or custom-liquid block).
- [ ] Consolidate accordions to a single **Material / care** collapsible. Currently shows four (`Materials`, `Shipping & Returns`, `Dimensions`, `Care Instructions`) — keep one combined block per spec §5.
- [ ] **Remove Share button** (currently rendered after the accordions).
- [ ] **Remove Related products** section if/when it appears (re-add in phase 2 backlog).
- [ ] Remove residual `Image with text` and 2-col `Free Shipping / Hassle-Free Exchanges` blocks (placeholder copy still present).
- [ ] Hide vendor "PRINTIFY" caption above title.

---

## E. Phase 4 — Collection page (`templates/collection.json`) + Nav

- [ ] Grid: 4 cols desktop / 2 cols mobile (currently 3 cols at 1440px).
- [ ] Filters: enable **Size** and **Product Type** facets (currently only `Availability`). Configure via Shopify admin → Online Store → Search & Discovery filters.
- [ ] Sort default: `Featured` (currently `Best selling`).
- [ ] Filter placement: top bar (already top, OK).
- [ ] Update Shopify admin **main-menu** → `Shop ▾` with 4 sub-items (Men / Women / Kids / Accessories). No blog link.
- [ ] Update Shopify admin **footer-menu** to: `Shop` column (Men / Women / Kids / Accessories) and `Help` column (FAQ / Shipping / Refund Policy / Terms / Contact). No blog link.
- [ ] Verify all 4 collections (`/collections/men`, `/women`, `/kids`, `/accessories`) exist with the products listed in spec §2.

---

## F. Phase 5 — Pages, copy, catalog

- [ ] Create page `/pages/size-guide` with size charts for tee + socks.
- [ ] Review FAQ copy at `/pages/faq` (template already exists: `templates/page.faqs.json`).
- [ ] Confirm `/pages/shipping-and-handling` and `/pages/contact` copy.
- [ ] Do **not** create `/pages/about` for launch (phase 2 backlog).
- [ ] Catalog cleanup in Shopify admin:
  - [ ] **Unpublish** Matte Vertical Posters
  - [ ] Confirm prices: socks $15.38, kids tee $18.30, adult long-sleeve tee $30.20, others TBD
  - [ ] Ensure ≥ 2 photos per published SKU (front + lifestyle/detail)
  - [ ] Audit current 23 men's products (e.g. `no-war-socks`, Ukraine-themed sweatshirts) — keep only items that fit the new brand positioning
- [ ] Rewrite collection descriptions (current Men collection blurb is generic AI copy).
- [ ] Strip POD/Printify language from any product titles, descriptions, and tags (UI-visible only).

---

## G. Phase 6 — Blog hidden

- [x] No blog link in localhost header nav (verified).
- [x] No blog link in localhost footer (verified — only policies + FAQ + Shipping).
- [ ] Confirm in Shopify admin nav menus that `news` / `blog` is removed.
- [ ] Verify no homepage section references blog posts (confirmed — `templates/index.json` has none).
- [ ] Do **not** delete `blogs/news` or its posts — preserve data.

---

## H. Phase 7 — QA + Launch

- [ ] `shopify theme check` clean (zero errors).
- [ ] Lighthouse perf ≥ 90 mobile (CI runs this).
- [ ] Mobile viewport review (375 / 414): hero, category tiles, product cards, drawer nav.
- [ ] Tablet viewport review (768).
- [ ] Click every nav and footer link — no `#` dead anchors, no `/blogs/news` link.
- [ ] Verify `/blogs/news` and `/blogs/news/<post>` URLs still load (data preserved) but not linked.
- [ ] Cart drawer end-to-end: add → drawer opens → checkout button works.
- [ ] Test on real iOS Safari + Android Chrome.
- [ ] Merge `dev` → `main`, connect `main` to live theme in Shopify admin.

---

## I. Assets needed (blocks A, C, D)

- [ ] Hero image — lifestyle photo, ≥ 2400 × 1600 px
- [ ] Category tile images — 4 square (Men / Women / Kids / Accessories)
- [ ] Logo — SVG variant suited to Off-White bg (current is white-on-dark)
- [ ] Favicon (16 / 32 / 180 / 512)
- [ ] Per-product photos — front + lifestyle, all currently published SKUs

Until photography ships, use placeholder pattern from spec §13: solid `#0F0F0F` bg + centered Playfair text.

---

## J. Out of scope (Phase 2 backlog — do not start)

Reviews, upsell/cross-sell, Instagram feed, back-in-stock, About page, Blog activation, loyalty, catalog expansion. See `SPEC.md` §14.
