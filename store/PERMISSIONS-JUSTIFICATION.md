# CollectorLens — Permissions Justification (Chrome Web Store)

> Mapped to the **real `manifest.json`** (§2 — no invented permissions). Wording follows the
> 2026 Chrome program policy: *narrowest permissions*, *fully disclose how each is used*,
> *Limited Use*. Copy the **paste-ready** blocks into the Store dashboard → *Privacy practices*.
>
> Source of truth: `manifest.json` v0.2.0. Verified scopes below — nothing else is requested.

---

## What the manifest actually requests

| Scope (verbatim from manifest.json) | Type | Why it exists |
|---|---|---|
| `"host_permissions": ["https://www.ebay.com/*"]` | Host permission | (a) read the comic's title/issue/grade on the eBay page you're viewing; (b) fetch eBay's **own public** Sold/Completed listings of the same issue+grade *in your session* to compute the range. |
| `content_scripts.matches`: `https://www.ebay.com/sch/*`, `/itm/*`, `/b/*` | Injection scope | Limits where the badge UI runs — eBay **search**, **item**, and **browse** pages only. Narrower than the host permission. |
| `web_accessible_resources`: `key-issues.json` → `https://www.ebay.com/*` | Bundled resource | The key-issue list is a static file shipped inside the extension; MV3 requires declaring it web-accessible so the content script can load it. No network, no data leaves. |

**No API permissions are requested at all** — the `manifest.json` has **no `permissions` array**.

### Explicitly NOT requested (the "narrowest" proof)
`storage` · `tabs` · `activeTab` · `scripting` · `cookies` · `webRequest` · `webNavigation` ·
`history` · `<all_urls>` · any host other than `www.ebay.com` · any remote/hosted code.
All logic is bundled in the package (MV3-compliant).

---

## Paste-ready: Store dashboard fields

### Single purpose (required, one sentence)
> CollectorLens has one purpose: show recent eBay sold-comps (as a price range), key-issue
> markers, and an edition warning inline on eBay comic listings — so collectors don't open a
> second tab to research value.

### Permission justification — Host permission `https://www.ebay.com/*` (required field)
> Used only on eBay pages. CollectorLens reads the comic's title (issue + grade) from the
> listing you are already viewing, and fetches eBay's own public "Sold/Completed" listings for
> the same issue and grade within your current session to calculate a price range. It is not
> used on any other website, and it requests no host beyond www.ebay.com.

### Remote code
> No. CollectorLens executes no remote or hosted code. All scripts (`config.js`, `parser.js`,
> `review.js`, `content.js`) and data (`key-issues.json`) ship inside the package.

### Data usage / Limited Use (certification)
> - **Collects personal or sensitive user data?** No.
> - **Sells or transfers user data?** No.
> - **Uses or transfers data for purposes unrelated to the single purpose?** No.
> - **Uses or transfers data to determine creditworthiness / for lending?** No.
>
> CollectorLens has no server and no account. It does not collect, store remotely, or transmit
> any user data. Everything happens locally in the browser, on the eBay page you are viewing.

---

## Honest technical disclosures (so the review is not later flagged)

**1. The sold-comps fetch runs in your eBay session (`credentials: "include"`).**
The comps request is a normal first-party request to `www.ebay.com/sch/...` — the same public
Sold/Completed search a user can open themselves. Because it is same-site, the browser attaches
the user's existing eBay cookies automatically (exactly as normal browsing does). CollectorLens
**never reads, stores, or transmits cookies or any session/auth data** — it only parses the
public sold **prices** out of the returned HTML, in memory, for the current page. (Platform-risk
note for internal use: this client-side auto-fetch is the eBay-UA "AMBER" item from the
2026-06-08 publish review — disclosed here for transparency, no policy change.)

**2. Local review-prompt counter (review.js) — on-device only, not "collected data".**
To show the one-time "leave a review" prompt only **after a few successful uses** (never at
install, never repeatedly), `review.js` keeps a tiny counter in the page-origin `localStorage`
(`cl_success_pages`, `cl_review_done`). This is a small integer + a "shown once" flag. It never
leaves the device, contains no personal data, and is **not** why the answer to "collects user
data" is *No* — it simply isn't user data. It requires **no** `storage` permission (deliberately
kept out of the manifest to preserve the narrowest-permission posture).

**3. In-memory only.** Parsed prices, the computed range, and the per-page cache live only for
the lifetime of the tab. Nothing is persisted server-side; there is no server.

---

## Cross-check against the manifest (do this before each submission)
- [ ] `host_permissions` still exactly `["https://www.ebay.com/*"]` — no broader host crept in.
- [ ] No `permissions` array added (or, if one is ever added, it appears in the table above with a justification).
- [ ] `web_accessible_resources` still only `key-issues.json`, matched to `www.ebay.com` only.
- [ ] No remote `<script src>`, no `eval`, no hosted code — `grep` clean.
- [ ] Privacy-practices answers above still true after any code change.
