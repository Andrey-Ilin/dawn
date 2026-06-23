# Product Tags — Pre-Publish Checklist

What to set on a product **before publishing** so it lands in the right collections.
Collections are driven entirely from Shopify admin (smart-collection conditions +
Search & Discovery), not theme code.

**Everything is tag-based** so it can be set from **Printify** (Printify can set Tags,
but it cannot set Shopify's native *Product type* field). One product = a handful of
tags, no manual Shopify step.

> **Format rule:** tags are exact, lowercase, `prefix:value`
> (e.g. `theme:retro-revival`, **not** `Theme: Retro Revival`). A mismatch silently
> drops the product from its collection.

---

## Quick checklist

- [ ] **One** `type:*` tag (category).
- [ ] **One** `theme:*` tag.
- [ ] **One** `gender:*` tag.
- [ ] **Capsule** tag(s) if part of a seasonal drop (optional).
- [ ] Description has intro + `<ul>` specs + `<table id="size-guide">`
      (see [product-description-template.md](product-description-template.md)).

---

## Tags

### Type — category, pick exactly one

Drives the category collection **and** the Material / Care accordion content.

```
type:t-shirt
type:hoodie
type:sweatshirt
type:socks
type:bag
```

### Theme — pick exactly one (drives main nav collection)

```
theme:retro-revival
theme:music-culture
theme:abstract-geometric
theme:global-cause
theme:city-series
```

### Gender — pick one

```
gender:men
gender:women
gender:unisex
```

### Capsule — seasonal drop, zero or more (optional)

```
capsule:summer-motion
capsule:back-to-street
capsule:music-pulse
```

> **Native Product type field:** optional. Printify can't set it, so we don't rely on
> it. If you populate it manually (for Shopify SEO/reporting), the Material/Care
> section will also honour it as a fallback — but the `type:*` tag is the source of
> truth.

---

## Collection → condition reference

| Collection | Condition |
|------------|-----------|
| T-shirts | tag `type:t-shirt` |
| Hoodies & Sweatshirts | tag `type:hoodie` **or** `type:sweatshirt` |
| Backpacks & Bags | tag `type:bag` |
| Socks | tag `type:socks` |
| Retro Revival | tag `theme:retro-revival` |
| Music & Culture | tag `theme:music-culture` |
| Abstract & Geometric | tag `theme:abstract-geometric` |
| Global & Cause | tag `theme:global-cause` |
| City Series | tag `theme:city-series` |
| Music Pulse | tag `capsule:music-pulse` |
| Back To Street | tag `capsule:back-to-street` |
| Summer Motion | tag `capsule:summer-motion` |
| Women / Men / Unisex | **TBD** — see below |
| New Arrivals / Best Sellers / Limited Drops | **TBD** — see below |
| Main | manual / featured |

---

## Migration — what to change

Because category moves from the **Product type** field to a `type:*` **tag**:

1. **Shopify admin (collections):** change the 4 category collections from
   `Product type is equal to X` to `Product tag is equal to type:X`:
   - T-shirts → `type:t-shirt`
   - Hoodies & Sweatshirts → `type:hoodie` OR `type:sweatshirt`
   - Backpacks & Bags → `type:bag`
   - Socks → `type:socks`
2. **Theme (`snippets/product-material-care.liquid`):** key the Material/Care content
   off the `type:*` tag (fallback to `product.type` if present).
3. **Docs (`product-description-template.md`):** replace the "set the Type field"
   guidance with "add the `type:*` tag".
4. **Printify:** add the `type:*` tag (plus `theme:*`, `gender:*`, optional
   `capsule:*`) to each product's publishing tags.

---

## ⚠️ Needs confirmation (no automated condition set yet)

These collections currently have **no smart condition** — either manual or not yet
configured. Decide and set them, then the tags below apply:

- **Women / Men / Unisex** — intended to use `gender:*` tags. Set each as a Smart
  collection on `gender:women` / `gender:men` / `gender:unisex`, or manage manually.
  Until set, the `gender:*` tags still power Search & Discovery filters.
- **New Arrivals / Best Sellers / Limited Drops** — if tag-driven, use
  `collection:new-arrivals`, `collection:best-sellers`, `collection:limited-drops` and
  set those smart conditions; otherwise curate manually.
- **Main** — manual / featured selection; no tag.
