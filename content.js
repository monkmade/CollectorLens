/*
 * CollectorLens — Content script.
 * Liest eBay-Comic-Listing-Titel, parst Issue+Grade, holt Sold-Comps gleicher Issue+Grade
 * first-party im Nutzer-Tab und blendet RANGE + Key-Issue + Editions-Warnung inline ein.
 * Option-2-Scope (CEO 2026-06-08): KEIN Einzelwert — nie eine potenziell falsche Zahl (§2).
 */
(function () {
  "use strict";
  var CL = window.CollectorLens;
  if (!CL) return;

  var KEY_ISSUES = [];
  try {
    fetch(chrome.runtime.getURL("key-issues.json"))
      .then(function (r) { return r.json(); })
      .then(function (d) { KEY_ISSUES = d || []; scan(); })
      .catch(function () {});
  } catch (e) {}

  var seen = new WeakSet();
  var cache = new Map();      // key -> number[] | "err"
  var queue = [];
  var active = 0;
  var MAX = 2;                // höflich zu eBay (§20, kein Rate-Limit-Risiko)

  function pump() {
    while (active < MAX && queue.length) {
      var job = queue.shift();
      active++;
      job().then(done, done);
    }
    function done() { active--; pump(); }
  }

  function isKey(series, issue) {
    if (!series || !issue) return null;
    var s = series.toLowerCase();
    for (var i = 0; i < KEY_ISSUES.length; i++) {
      var k = KEY_ISSUES[i];
      if (k.i === String(issue) && s.indexOf(k.s) !== -1) return k.k || "Key Issue";
    }
    return null;
  }

  function fetchComps(series, p) {
    var url = CL.buildSoldUrl(series, p);
    return fetch(url, { credentials: "include" }).then(function (res) {
      if (!res.ok) throw new Error("http " + res.status);
      return res.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var cards = doc.querySelectorAll(".su-card-container");
      var issRe = new RegExp("(^|[^0-9])" + p.issue + "([^0-9]|$)");
      var grRe = new RegExp(p.grade.replace(".", "[.\\-]"));
      var prices = [];
      cards.forEach(function (c) {
        var tEl = c.querySelector(".s-card__title");
        var pEl = c.querySelector(".s-card__price");
        if (!tEl || !pEl) return;
        var tt = tEl.textContent;
        if (!issRe.test(tt) || !grRe.test(tt) || !/cgc|cbcs|pgx|egs/i.test(tt)) return;
        var m = pEl.textContent.match(/\$\s?([\d,]+\.\d{2})/);
        if (m) prices.push(parseFloat(m[1].replace(/,/g, "")));
      });
      prices.sort(function (a, b) { return a - b; });
      return prices;
    });
  }

  function money(v) { return "$" + Math.round(v).toLocaleString("en-US"); }

  function badgeEl(card) {
    var b = card.querySelector(".cl-badge");
    if (!b) {
      b = document.createElement("div");
      b.className = "cl-badge";
      card.appendChild(b);
    }
    return b;
  }

  function render(card, p, keyNote, comps) {
    var b = badgeEl(card);
    var parts = [];
    parts.push('<span class="cl-tag cl-id">' + p.grader + " " + p.grade + " · #" + p.issue + "</span>");
    if (keyNote) parts.push('<span class="cl-tag cl-key">🔑 ' + keyNote + "</span>");
    if (comps === "pending") {
      parts.push('<span class="cl-tag cl-range cl-muted">Sold-Comps …</span>');
    } else if (comps === "err" || !comps || !comps.length) {
      parts.push('<span class="cl-tag cl-range cl-muted">No comps found</span>');
    } else {
      parts.push('<span class="cl-tag cl-range">Sold-Range ' + money(comps[0]) + "–" + money(comps[comps.length - 1]) + " · " + comps.length + " Comps</span>");
      parts.push('<span class="cl-tag cl-warn">⚠️ Check edition (Original vs. Reprint/Facsimile)</span>');
    }
    b.innerHTML = parts.join("");
  }

  function process(card) {
    if (seen.has(card)) return;
    var tEl = card.querySelector(".s-card__title");
    if (!tEl) return;
    seen.add(card);
    var title = tEl.textContent.trim();
    if (!title || /^shop on ebay$/i.test(title)) return;
    var p = CL.parseTitle(title);
    if (!p.parseable) return;                 // Lots/unklar -> nichts anzeigen, nie raten
    var keyNote = isKey(p.series, p.issue);
    render(card, p, keyNote, "pending");

    var key = (p.grader + p.grade + p.issue + p.series).toLowerCase();
    if (cache.has(key)) { render(card, p, keyNote, cache.get(key)); return; }

    var io = new IntersectionObserver(function (ents, obs) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.disconnect();
        queue.push(function () {
          return fetchComps(p.series, p).then(function (comps) {
            cache.set(key, comps); render(card, p, keyNote, comps);
          }, function () {
            cache.set(key, "err"); render(card, p, keyNote, "err");
          });
        });
        pump();
      });
    }, { rootMargin: "300px" });
    io.observe(card);
  }

  function scan() {
    var cards = document.querySelectorAll(".su-card-container");
    for (var i = 0; i < cards.length; i++) process(cards[i]);
  }

  var mo = new MutationObserver(function () { scan(); });
  try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  scan();
})();
