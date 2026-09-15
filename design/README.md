# Design source

The actual Claude Design source for the CYPHERPUNK App, obtained 2026-09-15
after three failed import attempts (see `docs/05-open-decisions.md` #7) —
finally provided directly as a zip export rather than via the design-canvas
handoff, which never worked in this environment.

- **`CYPHERPUNK App.dc.html`** — the canonical version. This is what
  `cypherpunk-app/cypherpunk-app/app/components/CypherpunkApp.js` was built
  from: exact copy, colors (`#F7931A` accent, `#050506` background),
  fonts (Space Grotesk + JetBrains Mono), the 5-screen tab structure
  (Home/Accel/CoS/Hub/Events), the hero scramble effect, GSAP entrance
  animations, the magnetic CTA button, and the shared Apply/Pitch/Become-a-
  member modal.
- **`CYPHERPUNK App v1 (loud).dc.html`** — an alternate variant with a
  marquee-style ticker instead of the fade-rotator and slightly different
  animation timing. **Not yet built** — if this one is actually preferred,
  say so and it's a variant to build from, not a from-scratch redesign.
- **`support.js`** — the Claude Design canvas runtime (`x-dc` custom
  element framework) these `.dc.html` files depend on to render inside the
  design tool. Not used by the actual Next.js app — it's reference only,
  for anyone who wants to open the `.dc.html` files directly in a browser
  to see the original mockup.

## Known deliberate departures from this source, in the real app

- **No phone bezel/notch.** The `.dc.html` renders inside a fixed
  390×844 rounded "phone" card (presentation chrome for previewing inside
  Claude Design). The real site drops that frame and lets the same
  content run full-height/responsive — a literal device bezel would look
  broken on an actual phone browser and is unnecessary chrome on desktop.
- **Live data, not simulated.** The source's ticker (GBP/BTC price, block
  height, sat/vB fee) runs on a fake `Math.random()` walk for demo
  liveliness. The real app fetches genuine numbers from mempool.space's
  public API instead, with the same rotation but real values — degrading
  to just the brand message if the fetch fails, never showing a fabricated
  number.
- **Honest success states.** The source's Apply/Newsletter/Events actions
  fake instant success ("APPLICATION RECEIVED ✓", "ADDED TO CALENDAR ✓")
  with no real backend behind them. The real app opens a `mailto:` draft
  instead (matching this repo's established pattern for un-backed forms)
  and labels the outcome honestly ("EMAIL DRAFT OPENED", "OPENING…")
  rather than claiming something was received or stored that wasn't.
