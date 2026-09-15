# Open decisions — not yet settled

Read this before assuming something is done. These were asked directly and
not yet answered, or answered ambiguously enough that no action was taken.

## 1. Connect Discord + Reddit for live automated posting?
Asked twice, not yet confirmed. Reddit in particular carries real ban/spam-flag
risk if posts go out on a schedule without a human reviewing each one first.
Nothing posts live until this is explicitly decided. See
`04-automation-status.md` for the full channel-by-channel breakdown.

## 2. "New token generated" (2026-09-15)
A message referenced a "new token" with no service named and no delivery
method specified. Asked which service (Discord bot token / Reddit API
credentials / something else) and how it should be connected (Zapier's own
OAuth vs. pasting the raw secret vs. it already living in a secrets store).
**Both questions were dismissed without an answer — no token has been used
or stored anywhere.** If this was meant to unblock Discord/Reddit posting,
it needs to be re-raised with those specifics.

## 3. "Chrome extension agent"
A message asked to "follow the chrome extension agent that is working."
No such agent exists in this session or anywhere reachable from it, and
nothing about a Chrome extension appears earlier in the project history.
Asked for clarification (a browser extension to build? a separate AI tool
running outside this session?) — **also dismissed without an answer.**

## 4. Admin-only entry form on the Fortress dashboard
Offered as an option so actual visit/lead numbers could be logged without
going through chat. Not yet requested or built — actuals are still reported
manually to whoever is running the session.

## 5. `/api/waitlist` backend
The landing page's waitlist form has nowhere real to send signups yet (see
`03-app-status.md`). No decision made yet on what to stand this up with.

## 6. What Cypherpunk actually is (privacy-Web3 community vs. hackathon space rental)
The site copy and growth calendar describe a privacy-first Web3
community/toolset. A separate conversation (2026-09-15, see
`06-seo-ai-citation-plan.md`) described Cypherpunk as a company that rents
space for hackathons. Asked directly which is accurate — answered "both,
it's evolved/pivoted," so the SEO plan runs two parallel content tracks.
**Not yet confirmed**: whether the hackathon-space business is actually live
or being built, since nothing about it exists elsewhere in this repo
(`index.html`, `03-app-status.md`) — the SEO plan's Track B (city landing
pages, pricing/capacity schema) shouldn't get real investment until that's
verified.

## 7. What Cypherpunk actually is, take 3: a Bitcoin startup accelerator
The actual Claude Design mockup (`CYPHERPUNK App.dc.html`, finally seen via
a screenshot on 2026-09-15 after three failed import attempts) shows
neither of the above. It's a mobile-app-styled landing page for
**"CYPHERPUNK — The Bitcoin Start-up Engine"**: a startup accelerator/studio
("We invest in and build the next generation of Bitcoin unicorns"), a
12-week founder cohort program, an "Apply as Founder" CTA, and backing
named as Fulgur Ventures and Initial Capital (real Bitcoin-focused VC
firms). Bottom nav shows 5 sections: Home / Accel / CoS / Hub / Events.

This retroactively explains "this cohort" from the very first message in
this project's conversation, which was answered at the time as a generic
crypto/Web3 community-growth question — it was actually about accelerator
cohort growth.

**This is the third distinct positioning surfaced across this repo's
history** (privacy-first Web3 community → hackathon space rental → Bitcoin
accelerator). This one is now confirmed authoritative: on 2026-09-15 the
actual design source (`CYPHERPUNK App.dc.html` + `support.js`) was
provided directly as a zip export and is preserved in `design/`. The
public landing page (`cypherpunk-app/cypherpunk-app/app/`) has been
rebuilt from it exactly — 5-tab structure (Home/Accel/CoS/Hub/Events),
copy, colors, fonts (Space Grotesk + JetBrains Mono), animations, and the
shared Apply/Pitch/Become-a-member modal. See `design/README.md` for the
few deliberate departures (no phone bezel, real Bitcoin data instead of
simulated, honest success states instead of faked ones).

**Still genuinely open**: the Launch Kit, Growth Calendar, weekly
rhythm/content pillars, and SEO plan were all built around "privacy-first
Web3 community" and have **not** been updated for the accelerator
positioning — they need a rewrite, not a tweak, and that work hasn't
started.
