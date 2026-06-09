# CollectorLens — Store Assets & Screenshot Capture Guide

This folder has two kinds of images:

1. **Rendered, ready-to-upload now** (exact Store dimensions, real `overlay.css` + real DOM):
   | File | Size | Store slot |
   |---|---|---|
   | `promo-tile-440x280.png` | 440×280 | Small promo tile |
   | `marquee-1400x560.png` | 1400×560 | Marquee promo tile |
   | `store-1-hero.png` | 1280×800 | Screenshot 1 (hero) |
   | `store-2-range.png` | 1280×800 | Screenshot 2 (the range) |
   | `store-3-key-edition.png` | 1280×800 | Screenshot 3 (key + edition) |
   | `overlay-reference.png` | 1280×800 | **internal QA only — do not upload** |
   | `icons/icon128.png` | 128×128 | Store icon (already in repo) |

2. **The genuine on-eBay capture (recommended gold standard).** The rendered screenshots use the
   product's **real UI** over a *generic* marketplace mock (no eBay logo, no real cover art, no
   account). The **numbers in them are illustrative examples** of the feature — the extension
   computes real ranges live. For the most credible listing, replace `store-1/2/3` with genuine
   live captures using the steps below. Both are honest; the live capture is just stronger.

> §2 / §10: never edit or invent the numbers in a live capture. If a range looks wrong, pick a
> different listing — do **not** doctor pixels. The whole product promise is "a real range, never
> a fake number."

---

## Capture the 3 live screenshots (~5 min)

### 0. Load the extension
- `chrome://extensions` → enable **Developer mode** (top-right) → **Load unpacked** →
  select the `CollectorLens` **folder** (load-unpacked takes a folder, not a zip).
- Note: `dist/` currently holds the submitted `collectorlens-0.1.0.zip`. The review-prompt code
  is staged as **0.2.0** in the source; a 0.2.0 zip is built only when you package the next upload.

### 1. ‼️ Anonymity / PII — do this FIRST (rule: no real name / account in any image)
Pick **one**:
- **Log out of eBay** before capturing (simplest), **or**
- Use a **fresh Chrome profile** with no eBay login, **or**
- Run in **Incognito** (extension page → "Allow in Incognito" ON).

Then verify before every shot — none of these may be visible:
- [ ] eBay account name, "Hi <name>", or avatar (top-right)
- [ ] Saved addresses, watchlist, or purchase history
- [ ] Any browser-profile name/photo in the toolbar
If anything slips in, **crop or blur it** before upload.

### 2. Go to a graded-comic search (US site)
- `https://www.ebay.com/sch/i.html?_nkw=cgc+9.8+comic` (or `cbcs 9.8 comic`).
- Wait until the green **`Sold-Range $… · … Comps`** pills appear under listings (a few seconds).
- Set the window to ~**1280×800** (DevTools device toolbar → "Responsive" → 1280×800 gives an exact frame).

### 3. Shoot
- **#1 Hero** — a results page with several badges visible (range + ⚠️ edition).
- **#2 The range** — zoom to one badge so the `Sold-Range … · N Comps` pill is the focus.
- **#3 Key + edition** — search a known key so the 🔑 marker shows, e.g.
  `https://www.ebay.com/sch/i.html?_nkw=amazing+spider-man+300+cgc+9.8`; capture the
  `🔑 …` + `⚠️ Check edition` pills together.
- *(optional #4)* a listing detail page (`/itm/…`) with the badge.

Use **Win + Shift + S** (Snip), or DevTools **⋮ → Capture screenshot**. Save as PNG, 1280×800 or 640×400.

### 4. (Optional, high-impact) 5–8 s demo GIF
- Record the moment the overlay appears (mouse over results → pills render).
- Windows: **ScreenToGif** or **ShareX** → export GIF (keep < ~3 MB; the Store accepts a YouTube
  link too if you prefer video).

---

## Store image rules (quick reference)
- Screenshots: **1280×800** or 640×400 PNG/JPEG — at least 1, up to 5.
- Small promo tile: **440×280**. Marquee: **1400×560**. Store icon: **128×128**.
- No deceptive claims, no other brands' logos as if endorsed, real product UI.

## Re-rendering the brand graphics (if copy/look changes)
Edit the matching `.html`, then (Windows, Edge headless):
```
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu ^
  --hide-scrollbars --window-size=440,280 ^
  --screenshot="store\assets\promo-tile-440x280.png" ^
  "file:///C:/Users/miche/Claude%20Projekte/CollectorLens/store/assets/promo-tile-440x280.html"
```
(Swap the size + file name for the marquee 1400×560 and the 1280×800 screenshots.)
