/*
 * CollectorLens — configuration. Edit values here only; no logic.
 */
(function () {
  "use strict";
  var CL = (window.CollectorLens = window.CollectorLens || {});

  // §14 demand probe: the "Pro coming - interested?" pill links here.
  // The pill stays HIDDEN until you replace REPLACE_ME with the real Tally/Gumroad URL.
  CL.PRO_INTEREST_URL = "https://tally.so/r/REPLACE_ME";

  // In-extension review prompt target (Chrome Web Store reviews tab for this item).
  // Item-ID = bbmhcifodggjilodahichpmjhciiadnm. The prompt only appears AFTER a few
  // successful uses and only when this URL is set (no "REPLACE_ME"). Live once published.
  CL.REVIEW_URL = "https://chromewebstore.google.com/detail/bbmhcifodggjilodahichpmjhciiadnm/reviews";
})();
