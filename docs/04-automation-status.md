# Automation status

## Task list
All 24 weeks of the growth calendar exist as individual tracked tasks
(week number, theme, moment, visits/leads targets). Week 1 is `in_progress`;
the rest are `pending`. This list lives in the session's task tracker — it
is not itself a file in this repo, but every week's content is mirrored in
`02-growth-calendar.md` and in the Fortress dashboard (see below).

## Scheduler
A recurring job drafts that day's content each morning (8:12am local),
based on the weekly rhythm and whichever week is `in_progress`, and logs
what it drafted to the Fortress dashboard.

**Real limits on this, stated plainly — not a design choice:**
- It is **session-only**. If the Claude session that created it ends, the
  job is gone.
- It **auto-expires after 7 days** even if the session stays alive.
- A 24-week campaign needs this either renewed weekly by whoever holds the
  session, or migrated to something durable (a real cron server, GitHub
  Actions, or a Zapier scheduled Zap) for unattended operation over months.

**It does not post anything live.** It drafts copy and puts it in chat for a
human to review and send. See "Live posting" below for why.

## Fortress — live status dashboard
A password-free but access-controlled dashboard: https://claude.ai/artifact/WVAMPt4gMYXGNeZopuZg3y

- **Access control is real, not cosmetic.** Declared via the artifact's `db`
  capability with a rule: `read: "interact"` (anyone shared on the artifact
  can view), `write: "admin"` (only the owner or people explicitly given
  editor access can ever write). Enforced by the platform, not by
  client-side JavaScript.
- Shows: weeks-completed count, cumulative visits/leads (actual vs. target)
  with on-pace/behind coloring, the full 24-week status table, and an
  agent activity log of what the daily scheduler has drafted.
- **"Actual" numbers are blank until someone reports real figures** — the
  page has no write UI by design (admin-only writes, no edit controls in
  the page itself). Numbers get updated by reporting them to whoever is
  running the Claude session, not by clicking around the dashboard.

## Live posting — NOT enabled, and the specific blockers
Checked via Zapier's app catalog:

| Channel | Status |
|---|---|
| Discord | Real write actions exist (post messages). Needs OAuth connection. |
| Reddit | Real write actions exist (submit posts/comments). Needs OAuth connection. Auto-posting at volume risks account bans/spam flags if not reviewed per post — flagged as a real risk, not hypothetical. |
| X/Twitter | **No posting integration exists at all** — X restricts third-party posting API access. Will always need a human to click publish. |
| Substack | **No API for third-party posting exists**, on Zapier or anywhere else. Always manual. |
| Threads | Only an unofficial third-party connector (not Meta's own) — shaky, not recommended. |

**Decision point still open:** connecting Discord + Reddit for automated
posting has not been authorized. This is deliberately not done silently —
see `05-open-decisions.md`.
