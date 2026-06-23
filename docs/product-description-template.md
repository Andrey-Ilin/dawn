# Product Description Template

How to write product descriptions so they render correctly on the storefront.
Author this in the Shopify admin product **Description** field (HTML / "Show HTML"
mode). Source copy usually comes from the supplier and is reshaped to the structure
below.

> The store should read like an ordinary fashion brand. **Never** mention the
> supplier, fulfilment method, print-on-demand, or "print" anywhere in customer copy.

---

## 1. Structure

A description has up to three parts, in this order:

```html
<p>Intro / marketing paragraph…</p>

<ul>
  <li>Spec bullet…</li>
  …
</ul>

<table id="size-guide"> … inches table … </table>
```

1. **Intro paragraph(s)** — short marketing copy. Renders as-is.
2. **Spec bullets** — product highlights (weight, fit, material, colour count,
   labels). Author as a real `<ul>` (see §3).
3. **Size table** — the inches table that powers the size-guide modal (see §2).

Do **not** add care, washing, or full material-composition blocks — those render
automatically in the **Material / Care** section based on the product type (see §4).

---

## 2. Size table (drives the size-guide modal)

The size table is the **source of truth in inches**. The theme hides it inline and
shows a **Size guide** link that opens a modal with **Inches** and **cm** tabs; the cm
tab is generated automatically.

Rules:

- The table **must** be `<table id="size-guide">`.
- **Header row** = size names (`S`, `M`, `L`, …). The first header cell is empty.
- **First column** = measurement labels ending in the unit `in`
  (e.g. `Width, in`, `Length, in`, `Sleeve length from center back, in`).
- All other cells = the measurement in **inches**.
- Author **only** the inches table. The theme:
  - converts each measurement to cm (`inches × 2.54`),
  - rewrites the label unit `in` → `cm`,
  - rounds with a "smart-snap" rule: values that are a clean conversion snap to a
    whole cm (e.g. `18.11" → 46.00`), genuine fractions keep two decimals
    (e.g. `1.00" → 2.54`, `1.50" → 3.81`).

Keep Printify's inline cell styles or strip them — the modal strips inline styles and
applies the theme's own table styling either way.

---

## 3. Spec bullets — convert `.:` lines to a list

Supplier copy often gives bullets as `.:` lines separated by `<br>`. Replace them with
a proper unordered list so they look like an ordinary store (the theme does **not**
auto-convert `.:`).

**Before (supplier):**

```html
<p>.: Heavyweight fabric (6.1 oz/yd²)<br />.: Relaxed fit<br />.: 100% ring-spun US cotton<br />.: Available in 58 colors<br />.: Sewn-in label</p>
```

**After (use this):**

```html
<ul>
  <li>Heavyweight fabric (6.1 oz/yd²)</li>
  <li>Relaxed fit</li>
  <li>100% ring-spun US cotton</li>
  <li>Available in 58 colors</li>
  <li>Sewn-in label</li>
</ul>
```

---

## 4. Material / Care is automatic — set the product type

The PDP **Material / Care** accordion is rendered from the product's **`type:*` tag**,
not the description (Printify can set tags but not Shopify's Product type field). The
same tag drives the category collection.

| `type:*` tag | Collection | Material / Care shown |
|--------------|------------|-----------------------|
| `type:t-shirt` | T-shirts | Cotton tee material + care + certifications |
| `type:hoodie` / `type:sweatshirt` | Hoodies & Sweatshirts | Fleece blend material + care |
| `type:socks` | Socks | Sock blend material + care |
| `type:bag` | Backpacks & Bags | Bag material + care |
| none | — | Generic care fallback |

Matching is case-insensitive and tolerates synonyms. If no `type:*` tag is present it
falls back to the native Product type field, then to a generic care block. To adjust
the copy, edit `snippets/product-material-care.liquid`. See
[product-tags-and-type.md](product-tags-and-type.md) for the full tag list.

---

## 5. Worked example — Comfort Colors 1717 tee

```html
<p>Comfort Colors introduces the &ldquo;Comfort Colors 1717&rdquo; garment-dyed t-shirt; a fully customizable tee made with 100% ring-spun cotton. The soft-washed, garment-dyed fabric brings extra coziness to your wardrobe while the relaxed fit makes it an excellent daily choice. Discover all 58 colors in our charts below.</p>

<ul>
  <li>Heavyweight fabric (6.1 oz/yd²)</li>
  <li>Relaxed fit</li>
  <li>Pre-shrunk 100% ring-spun US cotton</li>
  <li>Available in 58 colors</li>
  <li>Sewn-in label</li>
</ul>

<table id="size-guide">
  <thead>
    <tr><th></th><th>S</th><th>M</th><th>L</th><th>XL</th><th>2XL</th><th>3XL</th><th>4XL</th></tr>
  </thead>
  <tbody>
    <tr><td>Width, in</td><td>18.25</td><td>20.25</td><td>22.00</td><td>24.00</td><td>26.00</td><td>27.75</td><td>29.75</td></tr>
    <tr><td>Length, in</td><td>26.62</td><td>28.00</td><td>29.37</td><td>30.75</td><td>31.62</td><td>32.50</td><td>33.50</td></tr>
    <tr><td>Sleeve length from center back, in</td><td>16.25</td><td>17.75</td><td>19.00</td><td>20.50</td><td>21.75</td><td>23.25</td><td>24.63</td></tr>
    <tr><td>Size tolerance, in</td><td>1.50</td><td>1.50</td><td>1.50</td><td>1.50</td><td>1.50</td><td>1.50</td><td>1.50</td></tr>
  </tbody>
</table>
```

Add the tag **`type:t-shirt`** (plus `theme:*`, `gender:*`, optional `capsule:*`). The
storefront then shows: the intro + spec list, a Size guide link opening the Inches/cm
modal, and the tee Material / Care accordion — with no supplier or print-on-demand
wording anywhere.

---

## Checklist

- [ ] Intro paragraph(s) present, no supplier / POD / "print" wording.
- [ ] Spec bullets are a real `<ul>`, not `.:` lines.
- [ ] `<table id="size-guide">` present, **in inches**, header = sizes, first column
      labels end in `in`.
- [ ] No care/material/washing block in the description.
- [ ] One **`type:*` tag** set: `type:t-shirt`, `type:hoodie`, `type:sweatshirt`,
      `type:socks`, or `type:bag` (drives the category collection + Material/Care).
