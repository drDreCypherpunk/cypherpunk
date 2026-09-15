# App status

## What actually happened
The original ask was to import a Claude Design project (`CYPHERPUNK App.dc.html`
+ `support.js`) from claude.ai/design and implement it. That import never
completed — this session had no design authorization, `/design-login` can't run
in a non-interactive session, and the "Send to Claude Code Web" hand-off from
the Claude Design UI was never triggered successfully either. **The original
mockup's actual visual design was never retrieved and is not what's in this repo.**

Given the choice between waiting on that import or shipping something real
fast, the decision was: build a minimal real app now, fastest path, rather than
keep retrying the import.

## What's actually live in this repo
- `index.html` / `style.css` / `support.js` — a static landing page:
  hero, "what we're building," a Discord CTA as the primary conversion path,
  and an email waitlist form as fallback.
- Dark, single-theme (teal-on-graphite, IBM Plex Mono/Sans) — matches the
  visual identity used across the Launch Kit, Growth Calendar, and Fortress
  artifacts for consistency.
- Committed to branch `claude/cypherpunk-app-impl-7i56j1`.

## What's NOT done — before this goes public
- **`REPLACE_WITH_INVITE`** in `index.html` / `support.js` needs the real
  Discord invite link.
- **`REPLACE_WITH_HANDLE`** needs the real X handle.
- **No real backend.** The waitlist form POSTs to `/api/waitlist`, which does
  not exist yet. If that call fails, it falls back to opening a `mailto:`
  draft so no signup is silently lost — but that's a stopgap, not a lead
  capture system. Someone needs to stand up a real endpoint (or a
  third-party form service) before this is a working funnel.
- No connection yet to the actual product/tool described in the original
  design brief (a privacy-first crypto/Web3 tool) — this page describes it
  in plain language but doesn't embed or link to a working product yet.
