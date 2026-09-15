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
