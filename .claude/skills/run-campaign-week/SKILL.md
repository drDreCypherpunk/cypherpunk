---
name: run-campaign-week
description: Run one day/week of the Cypherpunk 24-week growth campaign — figure out what to draft today, log it, and advance the week when done. Use when asked to "run the campaign," "what's due today/this week," "draft today's content," or "advance the campaign week."
---

This is a content-operations workflow, not an app to launch — there's no
server or browser to drive. The daily scheduled job that used to run this
(`CronCreate`) is **session-only and expires after 7 days**, so this skill
is the durable version: anyone (or any future agent) can invoke it by hand
and get the same result the cron job would have produced.

## Source of truth

- **`campaign-plan.json`** (next to this file) — the full 24-week plan:
  targets, phases, the weekly rhythm, content pillars. Static reference data.
- **The session TaskList** (`TaskList`/`TaskUpdate` tools) — which week is
  actually `in_progress` right now. This is the *live* state; the JSON file
  has no concept of progress, only the plan.
- **The Fortress dashboard** (`https://claude.ai/artifact/WVAMPt4gMYXGNeZopuZg3y`)
  — where activity gets logged so owners can see it without touching this repo.

## Run (agent path)

1. **Find the current week.** Call `TaskList`. The task named `Week N — ...`
   with status `in_progress` is the current week (there should be exactly
   one; if none, the campaign hasn't started or just finished a week —
   check the last `completed` one and move the next to `in_progress`).

2. **Look up that week's plan row:**
   ```bash
   node .claude/skills/run-campaign-week/week-lookup.mjs <N>
   ```
   This prints the week's theme/targets, its phase, and — using today's
   actual weekday — which row of the weekly rhythm applies right now (e.g.
   Monday -> Build Log on X + Discord kickoff).

3. **Draft today's content** for whichever channel(s) `todaysRhythm` names,
   using the week's `theme` for the angle. Actual copy templates (seed DM,
   X thread, Substack post, Threads, Reddit) live in the Launch Kit
   artifact: `https://claude.ai/code/artifact/9066d438-21db-46a8-8cf3-3d97ae83c861`.
   Output the draft in chat for a human to review — **do not post it
   anywhere live** unless Discord/Reddit posting has been explicitly
   authorized (see `docs/04-automation-status.md` and
   `docs/05-open-decisions.md` in the repo root — as of this writing, it
   has not been).

4. **Log the run to the Fortress dashboard** — use the `ArtifactData` tool
   (this is the artifact's shared database; a separate tool from the
   `Artifact` tool that publishes/reads the page itself — the exact name
   has changed before, so if `ArtifactData` errors as unknown, `ToolSearch`
   for `select:ArtifactData` or search "artifact database" to find its
   current name):
   ```
   action: "list", url: "https://claude.ai/artifact/WVAMPt4gMYXGNeZopuZg3y", collection: "agentlog"
   ```
   to find the last `log-NNNN` id used, then:
   ```
   action: "set", url: "https://claude.ai/artifact/WVAMPt4gMYXGNeZopuZg3y",
   collection: "agentlog", doc_id: "log-<next-number>",
   data: { ts: "<current ISO timestamp>", week: N, summary: "<one sentence on what was drafted>" }
   ```
   Verified working 2026-09-15 (`log-0002` in that collection is this
   verification run).

5. **If every task for week N is done**, advance the campaign:
   - `TaskUpdate` week N's task to `completed`.
   - `TaskUpdate` week N+1's task to `in_progress`.
   - Update the Fortress dashboard with `ArtifactData`: `action: "update"`,
     `collection: "weeks"`, `doc_id: "w<N>"` → `{status: "completed"}`,
     and `doc_id: "w<N+1>"` → `{status: "in_progress"}`. Read each doc
     first (`action: "get"`) to pass its current `version` as `if_version`.

## Run (human path)

Read `docs/02-growth-calendar.md` and `docs/README.md` at the repo root —
same content as this skill's `campaign-plan.json`, in prose/table form for
someone not running an agent.

## Gotchas

- **The JSON file is not live state.** It has no `status` field on
  purpose — status lives in the TaskList (session-bound) and mirrored in
  the Fortress dashboard (durable, cross-session). Don't edit
  `campaign-plan.json` to mark progress; it'll just be wrong the next time
  someone reads it as "the plan."
- **`week-lookup.mjs`'s `todaysRhythm` is based on the real calendar day**,
  not the campaign week's day-1. If you're running this out of its normal
  daily cadence (e.g. catching up after a gap), treat `todaysRhythm` as a
  suggestion, not a hard rule — check what's already been drafted this
  week before duplicating a day's post.
- **Never post live without checking `docs/05-open-decisions.md` first** —
  it's the single place that tracks whether Discord/Reddit posting has
  been authorized. Assume "no" if it's not explicitly updated there.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `node week-lookup.mjs` prints "no such week" | Pass a number 1-24; check `TaskList` for the actual current week number first. |
| No task is `in_progress` in `TaskList` | Either week 24 just completed (campaign done) or nothing's been started — check the last `completed` task and move the next one to `in_progress` before drafting anything. |
| Fortress `write_db` rejects with a version conflict | Someone else wrote to that doc since you last read it. Re-read with `db_op: "get"`, take the new `version`, retry. |
