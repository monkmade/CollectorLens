# CollectorLens — Chrome Web Store Listing (Copy)

> §2: Alle Claims müssen wahr bleiben. Es wird KEIN exakter Einzelwert versprochen — nur eine
> Sold-Comps-Range + Editions-Warnung. §25: reine Store-Listing-Copy (kein Cold-Outreach).

## Name
CollectorLens — Comic Value for eBay

## Kategorie
Shopping

## Kurzbeschreibung (Summary, ≤ 132 Zeichen)
See sold-comps price range, key-issue flags & an edition warning right on eBay comic listings. No tab-switching. Free, no account.

## Single-Purpose-Statement (Pflicht, Chrome Policy)
CollectorLens has one purpose: it shows comic-book value context — a sold-comps price **range**, a key-issue marker, and an edition warning — inline on eBay comic listings, so collectors don't have to open a second tab to research value.

## Detaillierte Beschreibung
**Stop opening a second tab for every comic.**

CollectorLens adds a small badge to eBay comic listings while you browse. For each graded book it parses the **issue + grade** from the title and shows you, inline:

- 📊 **Sold-comps price RANGE** — the span (min–max) and number of recent eBay sold listings for the same issue & grade.
- 🔑 **Key-issue marker** — flags well-known key issues (first appearances etc.) from a built-in list.
- ⚠️ **Edition warning** — a clear reminder to check Original vs. Reprint/Facsimile, because those sell at very different prices.

**Honest by design.** CollectorLens deliberately shows a *range*, not a single "this is worth $X" number — because issue + grade alone can mix an original with a cheap reprint. A wrong number is worse than none. Use the range as a starting point and verify the edition before you buy.

**Private by design.** No account. No sign-up. No server. No tracking. Everything runs locally in your browser; CollectorLens only looks at the eBay page you're already viewing and eBay's own public sold-listings within your session.

Works on eBay comic search results and listings. Free.

### Keywords (für Store-SEO, §25)
comic value · CGC · CBCS · key issue · ebay comics · comic price · sold comps · comic book price guide · graded comics · comic flipping

### Permissions-Begründung (für Reviewer)
- `host_permissions: https://www.ebay.com/*` — nötig, um (a) den Titel des Listings zu lesen, das du gerade ansiehst, und (b) eBays eigene öffentliche „Sold/Completed"-Listings derselben Issue/Grade in deiner Sitzung abzurufen, um die Range zu berechnen. Keine weiteren Hosts.
- Keine `tabs`, `storage`-Remote, `scripting`-Remote, kein Remote-Code. Gesamte Logik ist im Paket enthalten (MV3).

## Screenshots (3–5, je 1280×800 oder 640×400)
1. eBay-Comic-Suche mit mehreren Badges (Range + ⚠️ Edition prüfen) unter den Listings.
2. Nahaufnahme einer Badge mit 🔑 Key-Issue-Marker (z. B. Amazing Spider-Man #300).
3. Eine Badge mit „keine Comps gefunden" (zeigt ehrliches Verhalten, kein erfundener Wert).
4. (optional) Listing-Detailseite mit Badge.
> Aufnahme-Hinweis: Extension via `chrome://extensions` „entpackt laden", auf eine eBay-Comic-Suche
> (`cgc 9.8 comic`) gehen, Badges abwarten, Fenster auf ~1280×800 stellen, Screenshot.

## Datenschutz-Disclosure (für das Store-Privacy-Formular)
- **Collects user data?** → No.
- **Sells/transfers data?** → No.
- **Remote code?** → No.
- Single purpose: comic value context on eBay listings.
- Privacy-Policy-URL: (siehe `docs/privacy-policy.html`, via GitHub Pages hosten — Platzhalter unten).
