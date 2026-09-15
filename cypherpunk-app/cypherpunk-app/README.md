# CYPHERPUNK App

Public pre-launch site + a password-gated admin dashboard for the 24-week
Cypherpunk growth campaign. Next.js (App Router), statically exported, hosted
on GitHub Pages. GitHub itself is the "vault": the code lives here, and the
admin dashboard reads/writes `content/campaign.json` straight from this repo
via the GitHub API — no separate database.

## What's here

```
app/
  page.js              Public landing page (hero, why-this-exists, waitlist)
  components/
    WaitlistForm.js    Client-side waitlist form (mailto fallback — see below)
  admin/
    page.js            Password-gated admin dashboard
  layout.js             Fonts (JetBrains Mono + IBM Plex Sans) + global shell
  globals.css           Design tokens (colors, type) used by every page
lib/
  auth.js               Client-side passphrase gate for /admin
  github.js              GitHub Contents API client (read/write campaign.json)
content/
  campaign.json          The data the admin dashboard edits — 24 weeks,
                          phases, visit/lead targets & actuals, waitlist note
.github/workflows/
  deploy.yml              Builds and deploys to GitHub Pages on every push to main
```

## One-time setup, in order

**1. Turn on GitHub Pages via Actions.**
Repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
(Not "Deploy from a branch" — the workflow here publishes the build artifact
directly.)

**2. Decide the admin passphrase, and set its hash as a secret.**
The passphrase never gets committed — only its SHA-256 hash does, as a build
env var. Generate the hash locally:

```bash
node -e "console.log(require('crypto').createHash('sha256').update(process.argv[1]).digest('hex'))" 'your-chosen-passphrase'
```

Copy the resulting hex string, then: repo → Settings → Secrets and variables →
Actions → **New repository secret** → name it `ADMIN_PASS_HASH`, paste the
hash as the value.

**3. (Optional) point the dashboard at a different repo.**
By default the admin dashboard reads/writes *this* repo (owner + name are
picked up automatically from GitHub Actions context at build time). To target
a different repo, add repo **Variables** (not secrets) named `GH_OWNER`,
`GH_REPO`, `GH_BRANCH` — see `.github/workflows/deploy.yml`.

**4. Push to `main`.** The `Deploy to GitHub Pages` workflow builds and
publishes automatically. First deploy takes a minute or two; check the
**Actions** tab if it doesn't show up at the Pages URL GitHub gives you
(Settings → Pages shows the live URL once the first deploy succeeds).

**5. Create a GitHub token for the admin dashboard itself.**
This is separate from the deploy workflow — it's what *you* (the admin) use
in your browser to save edits from `/admin`. Create a **fine-grained personal
access token** (Settings → Developer settings → Personal access tokens →
Fine-grained tokens) scoped to just this repo, with **Contents: Read and
write** permission. A classic token with the `repo` scope also works, but is
broader than it needs to be. Paste it into the dashboard the first time you
open `/admin` — it's stored only in that browser's `localStorage`, never
committed, never sent anywhere but `api.github.com`.

## Using the admin dashboard

Visit `/admin` on the deployed site. First visit: enter the passphrase from
step 2, then paste the GitHub token from step 5. After that, it loads
`content/campaign.json`, lets you edit visit/lead actuals and each week's
status, and **Save changes** commits straight back to `main` — which
re-triggers the deploy workflow, so the public numbers/status go live within
a minute or two of saving.

**Security model, plainly stated:** the passphrase is a soft UI gate only —
this is a static site with no server, so the check runs in the visitor's
browser against a hash that ships in the public JS bundle. It keeps casual
visitors out; it is not what protects your data. What actually protects your
data is that nothing can be *written* back to the repo without a valid
GitHub token scoped to it — and that check happens on GitHub's servers, not
in the browser. Use a real passphrase anyway (don't skip step 2), and if you
ever suspect your token leaked, revoke it from GitHub's token settings —
that's instant and doesn't require touching this code.

## Local development

```bash
npm install
npm run dev
```

Needs the same env vars as production to fully work (`NEXT_PUBLIC_GH_OWNER`,
`NEXT_PUBLIC_GH_REPO`, `NEXT_PUBLIC_ADMIN_PASS_HASH` at minimum) — create a
`.env.local` with those set, or just develop the public page and exercise
`/admin` against the deployed site.

## Known gaps, left intentionally rather than faked

- **Waitlist capture has no real backend yet.** The form on the landing page
  currently opens a pre-filled `mailto:` draft (see
  `app/components/WaitlistForm.js` and the `waitlist.note` field in
  `content/campaign.json`). Wire up a real endpoint (a Worker, a serverless
  function, a form service) before relying on it to actually collect leads.
- **The Discord/build-log link is a placeholder** (`app/page.js`,
  `BUILD_LOG_URL`) — swap in the real invite once one exists.
- This sandbox's network policy blocked `npm install` against the public npm
  registry, so the build could not be run and verified here end-to-end. The
  code was written and manually reviewed against standard Next.js 14 App
  Router + static-export patterns; GitHub Actions runs on a normal runner
  with full registry access, so `npm ci && npm run build` in the workflow is
  the real first verification. Watch the **Actions** tab after the first
  push — if it fails, the log will point at the exact line.
