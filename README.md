# CollectorLens

Chrome-Extension (MV3) — Inline-Overlay für eBay-Comic-Listings. Zeigt beim normalen eBay-Browsen
ohne Tab-Wechsel: **geparstes Issue + Grade**, **Sold-Comps-Range** (Spanne + Anzahl), einen
**🔑 Key-Issue-Marker** und eine **⚠️ Editions-Warnung**. Gratis, kein Konto, kein Server.

Status: **MVP 0.1.0** (Option-2-Scope, CEO-Decision 2026-06-08). Build-Track unter BUILD ENGINE.

## Designprinzip (wichtig)
Es wird **bewusst KEIN einzelner Wert** angezeigt, sondern eine **Range + Editions-Warnung**.
Grund: Issue+Grade allein vermischt Editionen (Original vs. Facsimile/Reprint) — im Live-Test war der
Original-Median ~$380, der Reprint-Median ~$70 (40 von 52 Treffern = Reprints). **Eine falsche Zahl ist
schlimmer als keine** (§2). Editions-Disambiguierung + Einzel-Präzisionswert = v2, erst nach belegter Nachfrage.

## Architektur
- `manifest.json` — MV3, Content-Script nur auf `ebay.com` (`/sch/`, `/itm/`, `/b/`), **kein Remote-Code**.
- `parser.js` — reine Regex für Issue+Grade (+ No-#-Fallback, Lot-/Reprint-Erkennung). Kein LLM.
- `content.js` — liest `.s-card__title`, parst, holt Sold-Comps gleicher Issue+Grade **first-party im
  Nutzer-Tab** (`LH_Sold=1&LH_Complete=1`), rendert die Range-Badge. Lazy via IntersectionObserver,
  max. 2 parallele Fetches, Cache pro Issue+Grade → höflich zu eBay (§20).
- `key-issues.json` — statische, lokale Key-Issue-Liste (Seed ~95 Einträge; auf ~200 erweiterbar).
- `overlay.css` — dezente Badge.

**Margen-sicher:** nur lokale Regex + statische JSON, **kein Pro-Klick-Server/LLM** (Money-Vorgabe).

## Lokal laden (zum Testen)
1. Chrome → `chrome://extensions` → „Entwicklermodus" an.
2. „Entpackte Erweiterung laden" → diesen Ordner wählen.
3. Auf eine eBay-Comic-Suche gehen (z. B. `cgc 9.8 comic`) → Badges erscheinen unter den Listings.

## Selektoren (am Live-DOM verifiziert 2026-06-08)
`.su-card-container` (Card) · `.s-card__title` (Titel) · `.s-card__price` (Preis).
> Wartungs-Hinweis (§20): eBay ändert DOM-Klassen gelegentlich → bei Layout-Wechsel hier nachziehen.

## VOR Publish (offen, §30)
- [ ] eBay-User-Agreement final prüfen (on-demand, read-only, first-party im Nutzer-Tab — kein Bulk-Scraping/Caching).
- [ ] Chrome-Web-Store-Policy (single purpose, minimale Permissions, kein Remote-Code) final prüfen.
- [ ] Datenschutz: Extension sammelt/sendet keine Nutzerdaten (kein Server) — im Store-Listing dokumentieren.

## Stop-Loss (§5/§14)
< 300 Installs ODER < 3 Zahlende in 30 Tagen → Kill.
