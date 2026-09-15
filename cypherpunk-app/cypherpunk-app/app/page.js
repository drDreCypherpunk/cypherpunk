import WaitlistForm from "./components/WaitlistForm";

export const metadata = {
  title: "CYPHERPUNK App — Bitcoin-Native. Decentralised by Design.",
  description:
    "CYPHERPUNK App is a pre-launch, Bitcoin-native privacy tool being built in the open by Cypherpunk Private Limited. Follow along and join the waitlist.",
};

// TODO: replace with the real Discord/build-log invite link when it exists
const BUILD_LOG_URL = "#";

export default function Home() {
  return (
    <main>
      <header className="hero">
        <div className="wrap">
          <p className="eyebrow">Cypherpunk Private Limited &middot; Pre-launch</p>
          <h1>Bitcoin-Native. Decentralised by Design.</h1>
          <p className="lede">
            CYPHERPUNK App is a privacy tool we&rsquo;re building on Bitcoin,
            in public, before it&rsquo;s finished. There is no live product
            yet &mdash; no screenshots to show, no users, no metrics. What
            exists right now is a thesis, a team, and a build log. This page
            is where that gets tracked honestly, from before day one.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#waitlist">
              Join the waitlist
            </a>
            <a className="btn btn-ghost" href="#follow">
              Follow the build
            </a>
          </div>
        </div>
      </header>

      <section className="section" aria-labelledby="why-heading">
        <div className="wrap">
          <p className="eyebrow">Why this exists</p>
          <h2 id="why-heading">Privacy and decentralisation aren&rsquo;t features. They&rsquo;re the point.</h2>
          <div className="prose">
            <p>
              Cypherpunk Private Limited is a Bitcoin-native company building
              hardware, software, protocols and networks for a decentralised
              future. That work isn&rsquo;t confined to one industry &mdash;
              it applies across AI &amp; data, healthcare, biotech, land,
              water, energy, agriculture, mining, space tech and digital
              infrastructure, wherever centralised control creates fragile
              single points of failure.
            </p>
            <p>
              CYPHERPUNK App is the first product to come out of that work.
              It exists because most of the tools people rely on today quietly
              assume you&rsquo;ll trust a company, a server, or a third party
              with something you shouldn&rsquo;t have to hand over. We think
              that assumption is worth challenging, and Bitcoin &mdash; open,
              permissionless, verifiable &mdash; is the base layer to build
              that alternative on.
            </p>
            <p>
              We&rsquo;re building this in the open, before it&rsquo;s done,
              because a privacy tool built by two founders behind closed doors
              is a lot to ask people to trust blind. Showing the work as it
              happens is part of earning that trust, not a marketing tactic
              layered on top of it.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="follow" aria-labelledby="follow-heading">
        <div className="wrap">
          <p className="eyebrow">Follow along</p>
          <h2 id="follow-heading">Watch it get built, in real time.</h2>
          <p className="prose-lead">
            The build log &mdash; decisions, dead ends, and progress as it
            actually happens &mdash; lives in our Discord. No polish, no
            pretending things are further along than they are.
          </p>
          <a className="btn btn-primary" href={BUILD_LOG_URL}>
            {/* TODO: point this at the real Discord invite once one exists */}
            Join the build-log Discord
          </a>
        </div>
      </section>

      <section className="section section-waitlist" id="waitlist" aria-labelledby="waitlist-heading">
        <div className="wrap">
          <p className="eyebrow">Get notified</p>
          <h2 id="waitlist-heading">Join the waitlist</h2>
          <p className="prose-lead">
            Leave your email and we&rsquo;ll let you know as the product
            takes shape and when there&rsquo;s something real to try. No
            spam, no token, no hype cycle &mdash; just build-log updates and
            an early invite when it&rsquo;s ready.
          </p>
          <WaitlistForm />
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-name">Cypherpunk Private Limited</p>
          <p className="footer-tagline">Bitcoin-Native. Decentralised by Design.</p>
        </div>
      </footer>

      <style>{`
        .hero {
          padding: 96px 0 64px;
          border-bottom: 1px solid var(--border);
        }

        .hero h1 {
          font-size: clamp(28px, 6vw, 44px);
          margin-top: 14px;
          line-height: 1.15;
        }

        .lede {
          margin-top: 20px;
          max-width: 640px;
          font-size: 17px;
          color: var(--text-dim);
        }

        .hero-actions {
          margin-top: 32px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 12px 20px;
          border-radius: 4px;
          text-decoration: none;
          border: 1px solid transparent;
        }

        .btn-primary {
          background: var(--accent);
          color: var(--bg);
          border-color: var(--accent);
        }

        .btn-primary:hover {
          filter: brightness(1.08);
        }

        .btn-ghost {
          background: transparent;
          color: var(--text);
          border-color: var(--border-strong);
        }

        .btn-ghost:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .section {
          padding: 64px 0;
          border-bottom: 1px solid var(--border);
        }

        .section h2 {
          font-size: clamp(22px, 4vw, 30px);
          margin-top: 10px;
          max-width: 640px;
        }

        .prose {
          margin-top: 24px;
          max-width: 640px;
        }

        .prose p {
          color: var(--text-dim);
          margin: 0 0 16px;
        }

        .prose p:last-child {
          margin-bottom: 0;
        }

        .prose-lead {
          margin-top: 16px;
          max-width: 560px;
          color: var(--text-dim);
        }

        .section-waitlist {
          border-bottom: none;
          background: var(--surface);
        }

        .footer {
          padding: 40px 0 calc(40px + env(safe-area-inset-bottom, 0px));
        }

        .footer-name {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--text);
          margin: 0;
        }

        .footer-tagline {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-faint);
          margin: 6px 0 0;
        }

        @media (max-width: 480px) {
          .hero {
            padding: 64px 0 48px;
          }

          .section {
            padding: 48px 0;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .btn {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
