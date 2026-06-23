# Printify Pre-Publish Checklist

Do this in Printify **before** publishing a product to Shopify. Printify can set the
**description** and **tags** — that's all the theme needs (it can't set Shopify's
Product type field, so category comes from a `type:*` tag).

Details: [product-description-template.md](product-description-template.md) ·
[product-tags-and-type.md](product-tags-and-type.md)

---

## Checklist

**Description**
- [ ] Intro paragraph(s) — marketing copy only.
- [ ] Spec bullets converted from Printify's `.: item` lines to a real `<ul><li>…</li></ul>`.
- [ ] **No care / material / washing info** in the description — the theme adds the
      Material / Care section automatically from the `type:*` tag.
- [ ] No supplier / Printify / POD / "print" wording anywhere.

**Sizes**
- [ ] Size chart kept as `<table id="size-guide">`, **in inches** (source of truth).
- [ ] Header row = size names (S, M, L…); first column labels end in `in`
      (e.g. `Width, in`). The theme builds the Inches/cm modal automatically.

**Tags** (add all that apply — exact, lowercase, `prefix:value`)
- [ ] One **`type:*`** (category).
- [ ] One **`theme:*`**.
- [ ] One **`gender:*`**.
- [ ] **`capsule:*`** if part of a seasonal drop (optional).

---

## All tags (copy-paste)

```
# type — pick one (category + Material/Care)
type:t-shirt
type:hoodie
type:sweatshirt
type:socks
type:bag

# theme — pick one
theme:retro-revival
theme:music-culture
theme:abstract-geometric
theme:global-cause
theme:city-series

# gender — pick one
gender:men
gender:women
gender:unisex

# capsule — optional, seasonal
capsule:summer-motion
capsule:back-to-street
capsule:music-pulse
```

> A typical product = 3 tags (`type:` + `theme:` + `gender:`), plus a `capsule:` if
> it's in a drop. Mismatched/mistyped tags silently drop the product from its
> collection.
