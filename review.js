/*
 * CollectorLens — In-Extension Review-Prompt (ehrlich, einmalig, kein Nag).
 *
 * Erscheint NACH `THRESHOLD` erfolgreichen Nutzungen (= Seiten, auf denen mindestens eine
 * ECHTE Sold-Range gerendert wurde), NICHT beim Install. Einmalig + dismissbar.
 *
 * Chrome-Web-Store-Policy-konform:
 *   - keine 5-Sterne-Erpressung / kein "rate us 5 stars"
 *   - kein Gating von Features hinter einer Bewertung
 *   - kein wiederholtes Nerven (nach einmaligem Anzeigen NIE wieder)
 *
 * Privacy (§20 "sammelt nichts"): der Zähler lebt LOKAL in der page-origin localStorage
 * (ebay.com). Es wird nichts gesendet, kein Server, KEINE neue Permission. Wenn localStorage
 * nicht verfügbar ist, passiert schlicht nichts (Overlay wird nie blockiert).
 */
(function () {
  "use strict";
  var CL = (window.CollectorLens = window.CollectorLens || {});

  var THRESHOLD = 3;                    // nach so vielen erfolgreichen Seiten fragen ("3-5 Nutzungen")
  var KEY_COUNT = "cl_success_pages";   // lokaler Zähler (page-origin localStorage)
  var KEY_DONE  = "cl_review_done";     // "1" sobald einmal gezeigt -> nie wieder (kein Nag)

  var pageNoted = false;                // jede Seite max. 1x in den Zähler zählen
  var shownThisPage = false;

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Ziel-URL kommt aus config.js. Solange "REPLACE_ME" drin steht -> Prompt bleibt aus.
  function reviewUrl() {
    var u = CL.REVIEW_URL;
    return (u && u.indexOf("REPLACE_ME") === -1) ? u : null;
  }

  // Aufruf aus content.js: sobald auf DIESER Seite mind. eine echte Sold-Range gerendert wurde.
  CL.noteSuccess = function () {
    if (pageNoted) return;
    pageNoted = true;
    if (lsGet(KEY_DONE) === "1") return;                  // schon einmal gefragt -> nie wieder
    var n = (parseInt(lsGet(KEY_COUNT), 10) || 0) + 1;
    lsSet(KEY_COUNT, String(n));
    if (n >= THRESHOLD) showPrompt();
  };

  function showPrompt() {
    if (shownThisPage) return;
    var url = reviewUrl();
    if (!url) return;                                     // keine URL konfiguriert -> nie zeigen
    if (!document.body) return;
    shownThisPage = true;
    lsSet(KEY_DONE, "1");                                 // ab jetzt nie wieder (auch ohne Klick)

    var card = document.createElement("div");
    card.className = "cl-review";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "CollectorLens feedback");

    var close = document.createElement("button");
    close.className = "cl-review-x";
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss");
    close.textContent = "×"; // ×

    var title = document.createElement("div");
    title.className = "cl-review-title";
    title.textContent = "Is CollectorLens useful to you?";

    var body = document.createElement("div");
    body.className = "cl-review-body";
    body.textContent = "A short, honest review on the Chrome Web Store helps a lot.";

    var row = document.createElement("div");
    row.className = "cl-review-row";

    var rate = document.createElement("a");
    rate.className = "cl-review-btn";
    rate.href = url;
    rate.target = "_blank";
    rate.rel = "noopener noreferrer";
    rate.textContent = "Leave a review";

    var later = document.createElement("button");
    later.className = "cl-review-later";
    later.type = "button";
    later.textContent = "Not now";

    function dismiss() { if (card.parentNode) card.parentNode.removeChild(card); }
    close.addEventListener("click", dismiss);
    later.addEventListener("click", dismiss);
    // "Leave a review" öffnet die Store-Seite (neuer Tab) und schließt die Karte.
    rate.addEventListener("click", function () { setTimeout(dismiss, 0); });

    row.appendChild(rate);
    row.appendChild(later);
    card.appendChild(close);
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(row);
    document.body.appendChild(card);
  }
})();
