/*
 * CollectorLens — Title parser (pure, local, no LLM, no network).
 * Übernommen + gehärtet aus Gate-0 / Step-1-Mini-Gate (live am eBay-DOM verifiziert 2026-06-08).
 * Exponiert window.CollectorLens.{ parseTitle, buildSoldUrl }.
 */
(function () {
  "use strict";
  var CL = (window.CollectorLens = window.CollectorLens || {});

  var GRADERS = /\b(CGC|CBCS|PGX|EGS)\b/i;
  // Grader + (Dezimal-)Grade, adjazent. Toleriert "9.8" und Seller-Schreibweise "9-8".
  var GRADE_ADJ = /\b(CGC|CBCS|PGX|EGS)\b[^0-9]{0,8}(\d{1,2})[.\-](\d)/i;
  var BARE_GRADE = /\b(\d{1,2})[.\-](\d)\b/;
  var HASH_ISSUE = /#\s*(\d{1,5})/;
  var YEAR = /^(18|19|20)\d{2}$/;
  var LOT = /\b(lot|run|set|bundle|collection|reader)\b/i;
  var HASH_PLURAL = /#\d+\s*s\b/i; // "#1s"
  var REPRINT_HINT = /\b(facsimile|reprint|2nd\s*print|second\s*print|3rd\s*print|foil|marvel\s*tales|true\s*believers|fac)\b/i;

  function parseGrade(t) {
    var m = t.match(GRADE_ADJ);
    if (m) return { grader: m[1].toUpperCase(), grade: m[2] + "." + m[3] };
    // Grader vorhanden, aber Grade nicht adjazent -> naechste Dezimalzahl
    var gm = t.match(GRADERS);
    if (gm) {
      var b = t.match(BARE_GRADE);
      if (b) return { grader: gm[1].toUpperCase(), grade: b[1] + "." + b[2] };
    }
    return null;
  }

  function parseIssue(t) {
    var h = t.match(HASH_ISSUE);
    if (h) return h[1];
    // No-#-Fallback: erste Ganzzahl, die kein Jahr ist und nicht Teil eines Grade-Dezimals
    var cleaned = t.replace(GRADE_ADJ, " ").replace(/\b\d{1,2}[.\-]\d\b/g, " ");
    var toks = cleaned.match(/\b\d{1,5}\b/g) || [];
    for (var i = 0; i < toks.length; i++) {
      if (!YEAR.test(toks[i])) return toks[i];
    }
    return null;
  }

  function parseSeries(t, issue) {
    var idx = t.indexOf("#");
    var head;
    if (idx > 0) head = t.slice(0, idx);
    else if (issue && t.indexOf(issue) > 0) head = t.slice(0, t.indexOf(issue));
    else head = t.split(/\s+/).slice(0, 3).join(" ");
    return head.replace(/[^A-Za-z0-9 :'\-]/g, " ").replace(/\s+/g, " ").trim();
  }

  CL.parseTitle = function (title) {
    var t = (title || "").trim();
    var g = parseGrade(t);
    var issue = parseIssue(t);
    var lot = LOT.test(t) || HASH_PLURAL.test(t);
    return {
      raw: t,
      issue: issue,
      grader: g ? g.grader : null,
      grade: g ? g.grade : null,
      series: parseSeries(t, issue),
      isLot: lot,
      reprintHint: REPRINT_HINT.test(t),
      // "parseable" = sauberes Einzelbuch mit Grade + Issue. Lots/Unklar -> NICHT anzeigen.
      parseable: !!(g && issue && !lot)
    };
  };

  // eBay Sold/Completed-Suche gleicher Issue+Grade. First-party im Nutzer-Tab, KEIN externer Server.
  CL.buildSoldUrl = function (series, p) {
    var terms = [series, p.issue, p.grader, p.grade].filter(Boolean).join(" ");
    return "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(terms) +
      "&_sacat=63&LH_Sold=1&LH_Complete=1&_ipg=60";
  };
})();
