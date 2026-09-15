import StatusTicker from "./components/StatusTicker";
import BottomNav from "./components/BottomNav";
import NewsletterForm from "./components/NewsletterForm";

export const metadata = {
  title: "CYPHERPUNK — The Bitcoin Start-up Engine",
  description:
    "CYPHERPUNK invests in and builds the next generation of Bitcoin unicorns. A 12-week accelerator cohort: funding, technical resources, and policy access to scale.",
};

// TODO: replace these mailto fallbacks with real application/booking flows
// (a form, Typeform, Calendly, etc.) once they exist.
const APPLY_URL =
  "mailto:team@cypherpunk.io?subject=" + encodeURIComponent("Founder application");
const MEMBER_URL =
  "mailto:team@cypherpunk.io?subject=" + encodeURIComponent("Hub membership enquiry");
const PITCH_URL =
  "mailto:team@cypherpunk.io?subject=" + encodeURIComponent("Venture idea pitch");

const PORTFOLIO = [
  {
    name: "SOVRN",
    founder: "A. Edwards",
    tag: "Inheritance · non-custodial estate keys",
  },
  {
    name: "SATPAY",
    founder: "J. Lobos",
    tag: "Consumer fintech · Lightning-native wallet",
  },
  {
    name: "ENCLAVE",
    founder: "A. Filini",
    tag: "Cloud computing · sovereign compute nodes",
  },
];

const VENTURE_IDEAS = [
  "Bitcoin-native payroll",
  "Self-custody for teams",
  "Lightning point-of-sale",
];

const EVENTS = [
  {
    day: "02",
    month: "FEB",
    title: "Pitching & Raising Capital Panel",
    where: "Cypherpunk Offices · 18:30",
  },
  {
    day: "10",
    month: "FEB",
    title: "Building on Lightning Hackathon",
    where: "Cypherpunk Offices · All day",
  },
  {
    day: "19",
    month: "FEB",
    title: "Women of Bitcoin Summit",
    where: "Cypherpunk Offices · 10:00",
  },
];

export default function Home() {
  return (
    <>
      <StatusTicker />
      <main>
        {/* HOME */}
        <header className="section hero" id="home">
          <div className="wrap">
            <p className="eyebrow">/// Welcome to Cypherpunk</p>
            <h1 className="display">
              The Bitcoin
              <br />
              Start-up Engine
            </h1>
            <p className="lede">
              We invest in and build the next generation of Bitcoin unicorns.
            </p>
            <a className="btn btn-primary" href={APPLY_URL}>
              Apply as founder <span aria-hidden="true">&rarr;</span>
            </a>

            <div className="backed-by">
              <p className="tag">Backed by</p>
              <div className="backed-by-row">
                <span className="pill">Fulgur Ventures</span>
                <span className="pill">Initial Capital</span>
              </div>
            </div>

            <p className="prose">
              We help you do in{" "}
              <strong className="accent-text">12 weeks</strong> what usually
              takes a year &mdash; funding, technical resources, and
              high-level policy access to scale.
            </p>
          </div>
        </header>

        <section className="section" aria-labelledby="companies-teaser-heading">
          <div className="wrap">
            <div className="row-head">
              <p className="tag">02 /// Our companies</p>
              <a className="link-small" href="#portfolio">
                View all &rarr;
              </a>
            </div>
            <h2 id="companies-teaser-heading" className="visually-hidden">
              Our companies
            </h2>
            {PORTFOLIO.filter((c) => c.name !== "SOVRN").map((c) => (
              <div className="company-row" key={c.name}>
                <div>
                  <p className="company-name">{c.name}</p>
                  <p className="company-tag-small">{c.tag.split("·")[0].trim()}</p>
                </div>
                <span aria-hidden="true" className="arrow-icon">
                  &#8599;
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="hub-teaser-heading">
          <div className="wrap">
            <div className="card card-feature">
              <p className="tag">The Hub</p>
              <h2 id="hub-teaser-heading">The Right Room</h2>
              <p className="prose">
                Where Bitcoin&rsquo;s builders, investors, media and
                policymakers cross paths.
              </p>
              <a className="link-small" href="#hub">
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="newsletter-heading">
          <div className="wrap">
            <p className="tag">Newsletter</p>
            <h2 id="newsletter-heading" className="newsletter-heading">
              Latest news, events and research from CYPHERPUNK.
            </h2>
            <NewsletterForm />
          </div>
        </section>

        {/* ACCELERATOR */}
        <section className="section" id="accelerator" aria-labelledby="accel-heading">
          <div className="wrap">
            <p className="tag">01 /// Accelerator</p>
            <h2 id="accel-heading" className="display-small">
              12 Weeks to a Year
            </h2>
            <p className="prose lede-small">
              Everything an early-stage Bitcoin startup needs to scale
              &mdash; compressed into one cohort.
            </p>

            <div className="feature-cards">
              <div className="card">
                <p className="card-index">01</p>
                <h3>Funding</h3>
                <p className="prose">
                  Pre-seed cheque plus intros to Bitcoin-native funds and
                  angels.
                </p>
              </div>
              <div className="card">
                <p className="card-index">02</p>
                <h3>Technical Resources</h3>
                <p className="prose">
                  Lightning, Liquid and signing infra, plus protocol
                  engineers on call.
                </p>
              </div>
              <div className="card">
                <p className="card-index">03</p>
                <h3>Policy Access</h3>
                <p className="prose">
                  High-level access to regulators and the people shaping
                  Bitcoin policy.
                </p>
              </div>
            </div>

            <p className="tag timeline-label">The 12 weeks</p>
            <div className="timeline">
              <div className="timeline-row">
                <span className="timeline-week">W 1&ndash;3</span>
                <span>Build &amp; validate</span>
              </div>
              <div className="timeline-row">
                <span className="timeline-week">W 4&ndash;8</span>
                <span>Ship to first users</span>
              </div>
              <div className="timeline-row">
                <span className="timeline-week">W 9&ndash;11</span>
                <span>Raise the round</span>
              </div>
              <div className="timeline-row">
                <span className="timeline-week">W 12</span>
                <span>Demo day</span>
              </div>
            </div>

            <a className="btn btn-primary" href={APPLY_URL}>
              Apply as founder <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>

        {/* PORTFOLIO / CoS */}
        <section className="section" id="portfolio" aria-labelledby="portfolio-heading">
          <div className="wrap">
            <p className="tag">02 /// Our companies</p>
            <h2 id="portfolio-heading" className="display-small">
              Portfolio
            </h2>

            {PORTFOLIO.map((c) => (
              <div className="card company-card" key={c.name}>
                <div className="img-placeholder">
                  <span className="img-placeholder-label">
                    [ IMG &middot; {c.name} ]
                  </span>
                </div>
                <div className="company-card-body">
                  <div>
                    <h3>{c.name}</h3>
                    <p className="company-tag">{c.tag}</p>
                  </div>
                  <p className="company-founder">
                    Founder &middot; {c.founder}
                  </p>
                </div>
              </div>
            ))}

            <div className="venture-ideas">
              <p className="tag">Venture ideas</p>
              <p className="prose">
                Open problems we&rsquo;ll fund a founder to build.
              </p>
              <ul className="idea-list">
                {VENTURE_IDEAS.map((idea) => (
                  <li key={idea}>
                    <span>{idea}</span>
                    <span className="idea-open">Open</span>
                  </li>
                ))}
              </ul>
            </div>

            <a className="btn btn-ghost" href={PITCH_URL}>
              Pitch an idea <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>

        {/* HUB */}
        <section className="section" id="hub" aria-labelledby="hub-heading">
          <div className="wrap">
            <p className="tag">03 /// The Hub</p>
            <h2 id="hub-heading" className="display-small">
              The Right Room
            </h2>
            <p className="prose lede-small">
              Where Bitcoin&rsquo;s builders, investors, media and
              policymakers cross paths. The community is the product.
            </p>

            <div className="img-placeholder img-placeholder-tall">
              <span className="img-placeholder-label">
                [ IMG &middot; the co-working floor ]
              </span>
            </div>

            <div className="amenities-grid">
              <span>Coffee &amp; tea</span>
              <span>Fast internet</span>
              <span>Conference rooms</span>
              <span>Key card access</span>
              <span>24/7 security</span>
              <span>Community events</span>
            </div>

            <div className="card meeting-rooms-card">
              <div className="row-head">
                <h3>Meeting rooms</h3>
                <span className="bookable-badge">
                  <span className="status-dot-small" aria-hidden="true" />
                  Bookable
                </span>
              </div>
              <p className="prose">
                Reserve by the hour, paid in sats. Key-card entry, 24/7.
              </p>
            </div>

            <a className="btn btn-primary" href={MEMBER_URL}>
              Become a member <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>

        {/* EVENTS */}
        <section className="section" id="events" aria-labelledby="events-heading">
          <div className="wrap">
            <p className="tag">04 /// Events</p>
            <h2 id="events-heading" className="display-small">
              Gather with the Vanguard
            </h2>
            <p className="prose lede-small">
              Deep-dives, hackathons and demo days with the brightest minds
              in Bitcoin.
            </p>

            <p className="tag timeline-label">February</p>
            <div className="events-list">
              {EVENTS.map((e) => (
                <div className="event-row" key={e.title}>
                  <div className="event-date">
                    <span className="event-day">{e.day}</span>
                    <span className="event-month">{e.month}</span>
                  </div>
                  <div>
                    <p className="event-title">{e.title}</p>
                    <p className="event-where">{e.where}</p>
                  </div>
                </div>
              ))}
            </div>

            <a className="btn btn-ghost" href="#events">
              Upcoming events <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>

        <footer className="site-footer">
          <div className="wrap">
            <address>
              51-53 Hatton Garden
              <br />
              London EC1N 8HN
              <br />
              <a href="mailto:team@cypherpunk.io">team@cypherpunk.io</a>
            </address>
            <div className="social-row">
              {/* TODO: swap these placeholders for real profile URLs */}
              <a className="pill pill-small" href="#">
                X
              </a>
              <a className="pill pill-small" href="#">
                LinkedIn
              </a>
              <a className="pill pill-small" href="#">
                Substack
              </a>
              <a className="pill pill-small" href="#">
                TG
              </a>
            </div>
            <p className="copyright">&copy; 2026 Cypherpunk</p>
          </div>
        </footer>
      </main>
      <BottomNav />

      <style>{`
        .hero { padding-top: 40px; }
        .display {
          font-size: clamp(34px, 7vw, 48px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.06;
          text-transform: uppercase;
          margin: 14px 0 0;
        }
        .display-small {
          font-size: clamp(26px, 5vw, 32px);
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 8px 0 0;
        }
        .lede {
          font-size: 17px;
          color: var(--text-dim);
          margin: 20px 0 26px;
          max-width: 42ch;
        }
        .lede-small {
          margin: 10px 0 28px;
          max-width: 48ch;
        }
        .prose { color: var(--text-dim); margin: 0; }
        .prose + .prose { margin-top: 12px; }
        .accent-text { color: var(--accent); font-weight: 700; }

        .backed-by { margin-top: 32px; }
        .backed-by-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }

        .row-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }
        .link-small {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--accent);
          text-decoration: none;
          white-space: nowrap;
        }
        .link-small:hover { text-decoration: underline; }

        .company-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-top: 1px solid var(--border);
        }
        .company-name { font-size: 20px; font-weight: 700; margin: 0; }
        .company-tag-small { font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; font-family: var(--font-mono); color: var(--text-faint); margin: 6px 0 0; }
        .arrow-icon { color: var(--accent); font-size: 18px; }

        .card-feature { border-color: var(--accent); background: var(--accent-soft); }
        .card-feature h2 { margin: 8px 0 10px; font-size: 22px; }

        .newsletter-heading { font-size: 18px; font-weight: 600; margin: 6px 0 0; max-width: 40ch; }

        .feature-cards { display: flex; flex-direction: column; gap: 12px; margin: 24px 0 32px; }
        .card-index { font-family: var(--font-mono); color: var(--accent); font-size: 13px; margin: 0 0 8px; }
        .feature-cards h3 { font-size: 18px; margin: 0 0 8px; }

        .timeline-label { margin-bottom: 4px; }
        .timeline { border-top: 1px solid var(--border); margin-bottom: 28px; }
        .timeline-row {
          display: flex;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
          font-size: 15px;
        }
        .timeline-week { font-family: var(--font-mono); color: var(--accent); min-width: 68px; }

        .company-card { padding: 0; overflow: hidden; }
        .company-card .img-placeholder { margin: 0; border-radius: 0; border: none; border-bottom: 1px solid var(--border); }
        .company-card-body { padding: 16px 20px 20px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .company-card-body h3 { font-size: 19px; margin: 0 0 6px; }
        .company-tag { font-size: 13px; color: var(--text-faint); margin: 0; }
        .company-founder { font-family: var(--font-mono); font-size: 11.5px; color: var(--accent); white-space: nowrap; margin: 0; }

        .venture-ideas { margin: 32px 0 20px; }
        .venture-ideas .prose { margin-top: 6px; }
        .idea-list { list-style: none; margin: 16px 0 0; padding: 0; border-top: 1px solid var(--border); }
        .idea-list li {
          display: flex;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
          font-size: 15px;
        }
        .idea-open {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .img-placeholder-tall { aspect-ratio: 16 / 11; }

        .amenities-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
          padding: 20px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          font-size: 14.5px;
          margin-bottom: 24px;
        }

        .meeting-rooms-card { margin-bottom: 28px; }
        .meeting-rooms-card h3 { font-size: 17px; }
        .meeting-rooms-card .prose { margin-top: 8px; }
        .bookable-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--good);
          white-space: nowrap;
        }
        .status-dot-small { width: 6px; height: 6px; border-radius: 50%; background: var(--good); }

        .events-list { border-top: 1px solid var(--border); margin-bottom: 28px; }
        .event-row {
          display: flex;
          gap: 18px;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }
        .event-date { text-align: center; min-width: 40px; }
        .event-day { display: block; font-size: 20px; font-weight: 700; color: var(--accent); line-height: 1; }
        .event-month { display: block; font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); margin-top: 2px; }
        .event-title { font-size: 15.5px; font-weight: 600; margin: 0 0 4px; }
        .event-where { font-family: var(--font-mono); font-size: 12px; color: var(--text-faint); margin: 0; }

        .site-footer { border-top: 1px solid var(--border); padding: 40px 0 32px; }
        address { font-style: normal; font-size: 14px; color: var(--text-dim); line-height: 1.7; }
        address a { color: var(--accent); }
        .social-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 20px 0; }
        .pill-small { padding: 6px 12px; font-size: 12px; text-decoration: none; }
        .pill-small:hover { border-color: var(--accent); color: var(--accent); }
        .copyright { font-family: var(--font-mono); font-size: 11.5px; color: var(--text-faint); margin: 0; }

        .visually-hidden {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }

        @media (max-width: 480px) {
          .amenities-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
