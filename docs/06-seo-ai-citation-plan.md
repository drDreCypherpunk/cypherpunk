# SEO + AI-citation plan

**Goal:** rank on traditional search engines (Google/Bing) *and* get cited by
LLM answer engines (ChatGPT, Perplexity, Claude, Gemini, Copilot) for queries
relevant to Cypherpunk — weighted equally per the 2026-09-15 decision. This
plan folds into the existing 24-week growth campaign (`02-growth-calendar.md`)
rather than running as a separate calendar.

**Positioning note (open decision — see `05-open-decisions.md` #6):** the
site copy (`index.html`) and growth calendar describe a *privacy-first
Web3 community/toolset*. A separate description says Cypherpunk *rents space
to run/build software (hackathon venue)*. Per the 2026-09-15 decision this is
treated as "both — evolved/pivoted," so this plan runs **two keyword/content
tracks** rather than picking one. If that's wrong, tell me and I'll cut the
plan down to one track.

Semrush (rank tracking, competitor gap, real search-volume numbers) is wired
up but **out of API units as of 2026-09-15** — https://www.semrush.com/mcp-access
has options to add more. Everything volume/difficulty-labeled below is
directional (web research), not a Semrush pull. Re-run the keyword tables
through `mcp__Semrush__keyword_research` → `keyword_overview` /
`broad_match` / `phrase_questions` once units are available — that's the
first task in the plan.

---

## 1. How LLM citation actually works (GEO/AEO), and what changes for us

- GEO is ~80% brand-signal/authority, ~20% on-page technical. Getting quoted
  by ChatGPT/Claude/Perplexity depends more on *being mentioned by trusted
  third parties* (press, directories, other people's posts) than on-page
  tricks — but the on-page part is still necessary, it's just not sufficient.
- ChatGPT and Claude lean on training data first, retrieval second —
  long-lived, widely-syndicated, clearly-dated content wins there. Perplexity
  and Google AI Overviews lean on live retrieval — freshness and structured
  on-page facts matter more.
- Practical on-page checklist (apply to every new page/post, not a separate
  workstream):
  1. One-paragraph **TL;DR** at the top stating the answer before the
     explanation.
  2. Claims stated as plain declarative sentences with the evidence right
     next to them (a number, a source, a date) — this is the unit an LLM
     lifts and quotes.
  3. A **Q&A block** near the end using the actual phrasing people type into
     ChatGPT/Perplexity ("How much does it cost to rent a hackathon space?"),
     marked up with `FAQPage` schema.
  4. Visible **author + publish date + last-updated date** on every post —
     both Google and LLMs discount undated pages.
  5. A `/llms.txt` at the site root (emerging convention many crawlers now
     check) pointing to the highest-signal pages: about/manifesto, pricing
     or FAQ, key guides.
- Structured data to add site-wide: `Organization` (site root), `FAQPage`
  (every guide with a Q&A block), and — once the hackathon-space side is real
  — `LocalBusiness`/`Event`/`Product` (offer, price range, location) so both
  Google rich results and AI retrieval have a machine-readable fact sheet to
  cite instead of having to infer from prose.
- Track citations manually until a paid tool is added: run the tier-1
  queries from each track below once a week in ChatGPT, Perplexity, and
  Claude, and log whether Cypherpunk is mentioned, cited, or absent. This is
  the AI-search equivalent of rank tracking and there's no way around doing
  it by hand at this stage.

Sources: [WRITER — GEO/AEO 2026](https://writer.com/blog/geo-aeo-optimization/), [Enrich Labs — GEO complete guide](https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026), [LLMrefs — GEO 2026 guide](https://llmrefs.com/generative-engine-optimization)

---

## 2. Track A — Privacy-first Web3 community/toolset

Maps to content pillars **Privacy 101** (primary, SEO-shaped by design) and
**Culture & Manifesto**.

| Tier | Topic cluster | Example queries (search + AI-prompt phrasing) | Format |
|---|---|---|---|
| 1 (pillar) | What "cypherpunk" means today | "what is a cypherpunk", "cypherpunk manifesto explained", "is cypherpunk ideology still relevant 2026" | Evergreen manifesto/explainer page, kept updated |
| 1 (pillar) | Privacy-first crypto/Web3 tools | "privacy-first web3 tools", "how to use crypto without giving up privacy", "best self-custody privacy tools" | Guide + comparison table |
| 2 | Self-custody & wallet privacy | "how to hide wallet balance", "privacy coins vs zk-rollups explained", "does a VPN protect crypto transactions" | Substack essay (Privacy 101 slot) |
| 2 | Web3 privacy news/build-log | "[specific tool] build log", "what is [Cypherpunk] building" | Build-log thread → recap post (dual-purpose: community + citable history) |
| 3 | Community/culture | "web3 communities that actually build", "small crypto communities worth joining 2026" | Culture & Manifesto hot-takes, X/Threads |

Immediate wins: turn the site's own manifesto paragraph (`index.html`) into
a standalone, dated, Q&A-annotated page — it's already written, it just
needs the TL;DR/FAQ/schema treatment from section 1.

## 3. Track B — Hackathon / build-space rental

New track; no existing content yet. Local-intent + commercial-intent, which
is exactly the kind of query Google Business Profile and AI Overviews now
answer with structured facts rather than prose — so the schema work in
section 1 matters most here.

| Tier | Topic cluster | Example queries | Format |
|---|---|---|---|
| 1 (pillar) | Book the space | "hackathon space for rent [city]", "venue to rent for a hackathon", "coworking space with overnight access for hackathon" | Landing page per location, with `LocalBusiness`/price/capacity schema |
| 1 (pillar) | Hackathon organizer guide | "how to plan a hackathon", "hackathon venue checklist", "how much does it cost to rent a hackathon venue" | Long-form guide, FAQ-heavy — this is the page most likely to get cited verbatim |
| 2 | Comparison | "Cypherpunk vs Peerspace hackathon venues", "best hackathon spaces near me" | Comparison/listicle page (be honest and specific — comparison pages get cited more, not less, when they're candid about trade-offs) |
| 2 | Amenities/logistics | "hackathon venue wifi requirements", "how many people fit in a hackathon space", "24 hour hackathon venue rules" | FAQ page |
| 3 | Case studies | "[event name] hackathon recap", sponsor/organizer testimonials | Recap posts after each hosted event — real proof, real dates, real numbers, exactly what LLMs prefer over marketing copy |

Note the competitors surfaced in research (Peerspace, Giggster) rank almost
entirely on **city-specific landing pages** and **listicle-style directories**
— that's the structural gap to close first if Track B is real revenue, not
just a plan for the future.

Sources: [Peerspace — hackathon venues](https://www.peerspace.com/plan/hackathon), [Giggster — hackathon spaces](https://giggster.com/book/hackathon)

---

## 4. Traditional SEO foundation (applies to both tracks)

These are prerequisites, not optional extras — none of the content work
above compounds without them:

1. **Technical health**: valid sitemap.xml + robots.txt, HTTPS, mobile
   layout check (current `index.html`/`style.css` is a single static page —
   verify it passes Core Web Vitals before content volume ramps).
2. **Metadata**: unique `<title>`/`<meta description>` per page once there's
   more than the one landing page — right now everything would collapse onto
   the same title.
3. **Internal linking**: every new guide links back to the manifesto/about
   page and the waitlist/Discord CTA — content should feed the funnel, not
   dead-end.
4. **Backlinks**: press/guest-post outreach (the "80% of GEO is brand signal"
   point from section 1 — this is the same work serving both goals). Target
   5–10 industry publications per track (privacy/crypto press for Track A,
   startup/hackathon/coworking press for Track B).
5. **`/api/waitlist` backend** (already flagged in `03-app-status.md` and
   `05-open-decisions.md` #5): SEO traffic that hits a broken signup form is
   wasted traffic — this blocks the funnel side of the campaign math, not
   just this plan.

---

## 5. Folding into the 24-week campaign

No new calendar — reuse the existing weekly rhythm
(`02-growth-calendar.md`), reweighted:

- **Wednesday (Privacy 101 / Substack)** — becomes the primary Track A SEO
  slot. Apply the section-1 on-page checklist to every Substack post before
  it publishes, not after.
- **New standing task, no fixed day**: one Track B page per week starting
  whenever hackathon-space content is greenlit — city landing page, then
  organizer guide, then FAQ, then comparison page, in that priority order.
- **Monday build-log** and **Thursday culture posts** feed Track A tier-2/3
  — no format change, just tag them for the section-1 dated/TL;DR treatment
  when they get turned into permanent pages (build-logs currently live only
  as X threads, which LLMs retrieve far less reliably than an owned page).
- **Phase 1 (weeks 1–8)**: ship the technical foundation (section 4) +
  `/llms.txt` + schema markup + the Track A manifesto page. This is
  infrastructure, do it before content volume ramps, not alongside it.
- **Phase 2 (weeks 9–16)**: backlink/PR push (section 4.4) running in
  parallel with content volume — this is also where the weekly AI-citation
  check (section 1) should start, so there's enough runway to see it move.
- **Phase 3 (weeks 17–24)**: the event-driven spike week is a natural
  Track B moment if the hackathon-space product is live by then — real
  event pages and recaps outrank/out-cite manufactured content every time.

---

## 6. First 5 actions (do these before anything else in this plan)

1. Resolve the positioning question above for real (this plan guessed
   "both" per your last answer — confirm Track B is actually live/near-term
   before investing in city landing pages that describe a service that
   doesn't exist yet).
2. Add more Semrush API units, then re-run keyword research for both tracks
   to replace the directional tables in sections 2–3 with real volume/
   difficulty numbers and a competitor keyword-gap report.
3. Ship `/llms.txt` + `Organization`/`FAQPage` schema on the existing site.
4. Turn the manifesto paragraph already in `index.html` into its own dated,
   FAQ-annotated page (Track A tier-1, zero new writing required).
5. Start the weekly manual AI-citation check (section 1) now, even with only
   one page live — you need a baseline to know if anything's working.

---

*Last updated: 2026-09-15.*
