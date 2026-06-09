/*
 * CI: behavioral test for review.js (the in-extension review prompt).
 * Simulates independent page loads (fresh module scope each time) sharing one
 * persistent localStorage — like real navigation on ebay.com. Asserts the policy:
 * prompt appears EXACTLY once, only at the 3rd successful use, never at install,
 * never again after shown; pages without a real Sold-Range don't count.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "..", "review.js"), "utf8");

const store = new Map();
const localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
};

let prompts = 0;
function makeEl() {
  return {
    style: {}, parentNode: null,
    setAttribute() {}, addEventListener() {}, appendChild() {},
    set className(_) {}, set textContent(_) {}, set href(_) {},
    set target(_) {}, set rel(_) {}, set type(_) {},
  };
}
const document = {
  body: { appendChild() { prompts++; } },
  createElement: makeEl,
};

function loadPage(success) {
  const win = {};
  const run = new Function("window", "localStorage", "document", src + "\n;return window.CollectorLens;");
  const CL = run(win, localStorage, document);
  CL.REVIEW_URL = "https://chromewebstore.google.com/detail/bbmhcifodggjilodahichpmjhciiadnm/reviews";
  if (success) CL.noteSuccess();
  return CL;
}

let failed = 0;
function eq(name, got, want) {
  const ok = got === want;
  console.log((ok ? "PASS" : "FAIL") + "  " + name +
    (ok ? "" : "  (got " + JSON.stringify(got) + ", want " + JSON.stringify(want) + ")"));
  if (!ok) failed++;
}

loadPage(false);
eq("install/no-value page: no prompt", prompts, 0);
eq("install/no-value page: counter untouched", store.get("cl_success_pages") === undefined, true);

loadPage(true);
eq("1st successful use: no prompt yet", prompts, 0);
loadPage(true);
eq("2nd successful use: no prompt yet", prompts, 0);
loadPage(true);
eq("3rd successful use: prompt shown", prompts, 1);
eq("3rd successful use: done-flag persisted", store.get("cl_review_done"), "1");

for (let i = 0; i < 5; i++) loadPage(true);
eq("after shown once: never again (no nag)", prompts, 1);

const countAfter = store.get("cl_success_pages");
loadPage(false);
eq("no-value page later: still no increment", store.get("cl_success_pages"), countAfter);

store.clear(); prompts = 0;
const CL2 = (function () {
  const win = {};
  const run = new Function("window", "localStorage", "document", src + "\n;return window.CollectorLens;");
  const cl = run(win, localStorage, document);
  cl.REVIEW_URL = "https://tally.so/r/REPLACE_ME";
  return cl;
})();
CL2.noteSuccess();
const winB = {}; // two more pages with placeholder URL
for (let i = 0; i < 2; i++) {
  const run = new Function("window", "localStorage", "document", src + "\n;return window.CollectorLens;");
  const cl = run(winB, localStorage, document);
  cl.REVIEW_URL = "https://tally.so/r/REPLACE_ME";
  cl.noteSuccess();
}
eq("placeholder REVIEW_URL: prompt never shows", prompts, 0);

console.log(failed ? "\n" + failed + " FAILED" : "\nALL PASS");
process.exit(failed ? 1 : 0);
