/*
 * CI: unit tests for parser.js (pure, no DOM, no network).
 * Fixture titles mirror the real eBay title patterns the parser was built and
 * live-verified against (Gate-0 / Step-1-Mini-Gate, 2026-06-08): grader+grade adjacent,
 * seller spelling "9-6", #-issue, no-#-fallback, year exclusion, lots, reprint hints.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "..", "parser.js"), "utf8");
const win = {};
new Function("window", src)(win);
const { parseTitle, buildSoldUrl } = win.CollectorLens;

let failed = 0;
function eq(name, got, want) {
  const ok = got === want;
  console.log((ok ? "PASS" : "FAIL") + "  " + name +
    (ok ? "" : "  (got " + JSON.stringify(got) + ", want " + JSON.stringify(want) + ")"));
  if (!ok) failed++;
}

let p = parseTitle("Amazing Spider-Man #300 CGC 9.8 White Pages");
eq("ASM #300: parseable", p.parseable, true);
eq("ASM #300: grader", p.grader, "CGC");
eq("ASM #300: grade", p.grade, "9.8");
eq("ASM #300: issue", p.issue, "300");
eq("ASM #300: series", p.series, "Amazing Spider-Man");

p = parseTitle("New Mutants #98 CBCS 9-6 1st Deadpool");
eq("seller spelling 9-6: grade normalized", p.grade, "9.6");
eq("seller spelling 9-6: grader", p.grader, "CBCS");
eq("seller spelling 9-6: parseable", p.parseable, true);

p = parseTitle("X-Men 1 1991 CGC 9.8");
eq("no-# fallback: issue found", p.issue, "1");
eq("no-# fallback: year 1991 not mistaken for issue", p.issue !== "1991", true);
eq("no-# fallback: parseable", p.parseable, true);

p = parseTitle("CGC Amazing Spider-Man #300 9.8");
eq("grader not adjacent to grade: still resolves grade", p.grade, "9.8");
eq("grader not adjacent: issue from #", p.issue, "300");

p = parseTitle("Venom: Lethal Protector #1 CGC 9.8");
eq("series keeps colon", p.series, "Venom: Lethal Protector");

p = parseTitle("Incredible Hulk #181 CGC 3.5");
eq("single-digit grade", p.grade, "3.5");

p = parseTitle("Amazing Spider-Man comic lot of 20 CGC 9.8 #300");
eq("lot keyword: not parseable (never guess on lots)", p.parseable, false);
eq("lot keyword: isLot flag", p.isLot, true);

p = parseTitle("Marvel keys #1s CGC 9.8");
eq("plural #1s: treated as lot", p.parseable, false);

p = parseTitle("Amazing Fantasy #15 Facsimile Edition CGC 9.8");
eq("facsimile: reprint hint set", p.reprintHint, true);
eq("facsimile: still parseable (warning, not suppression)", p.parseable, true);

p = parseTitle("Amazing Spider-Man #300 VF/NM high grade");
eq("no grader: not parseable (raw books out of scope)", p.parseable, false);

const url = buildSoldUrl("Amazing Spider-Man", { issue: "300", grader: "CGC", grade: "9.8" });
eq("sold url: sold filter", url.indexOf("LH_Sold=1") !== -1, true);
eq("sold url: completed filter", url.indexOf("LH_Complete=1") !== -1, true);
eq("sold url: comics category", url.indexOf("_sacat=63") !== -1, true);
eq("sold url: terms encoded in order",
  url.indexOf(encodeURIComponent("Amazing Spider-Man 300 CGC 9.8")) !== -1, true);
eq("sold url: first-party ebay.com host", url.indexOf("https://www.ebay.com/sch/") === 0, true);

console.log(failed ? "\n" + failed + " FAILED" : "\nALL PASS");
process.exit(failed ? 1 : 0);
