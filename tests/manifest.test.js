/*
 * CI: manifest.json sanity. Catches the expensive mistake — uploading a zip the
 * Chrome Web Store rejects (= a wasted multi-day review cycle).
 * Also pins the "narrowest permissions" claim from store/PERMISSIONS-JUSTIFICATION.md:
 * if anyone broadens host_permissions or adds an API permission, CI fails loudly.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

let failed = 0;
function check(name, cond) {
  console.log((cond ? "PASS" : "FAIL") + "  " + name);
  if (!cond) failed++;
}

let m;
try {
  m = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
  check("manifest.json is valid JSON", true);
} catch (e) {
  check("manifest.json is valid JSON", false);
  process.exit(1);
}

check("manifest_version is 3", m.manifest_version === 3);
check("version is x.y.z", /^\d+\.\d+\.\d+$/.test(m.version || ""));
check("description within Chrome's 132-char limit",
  typeof m.description === "string" && m.description.length > 0 && m.description.length <= 132);

check("host_permissions is exactly ['https://www.ebay.com/*']",
  JSON.stringify(m.host_permissions) === JSON.stringify(["https://www.ebay.com/*"]));
check("no API permissions requested (narrowest-permissions claim)",
  !m.permissions || m.permissions.length === 0);

const refs = [];
for (const cs of m.content_scripts || []) refs.push(...(cs.js || []), ...(cs.css || []));
for (const war of m.web_accessible_resources || []) refs.push(...(war.resources || []));
refs.push(...Object.values(m.icons || {}));
refs.push(...Object.values((m.action && m.action.default_icon) || {}));
for (const f of [...new Set(refs)]) {
  check("referenced file exists: " + f, fs.existsSync(path.join(root, f)));
}

process.exit(failed ? 1 : 0);
