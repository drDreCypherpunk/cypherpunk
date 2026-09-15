"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import StatusStrip from "./StatusStrip";

// TODO: replace with a real application backend (form service, Airtable,
// etc.) once one exists. Every CTA here (Apply as Founder, Pitch an Idea,
// Become a Member) opens the same modal, matching the source design, and
// on submit opens a mailto draft with the entered fields.
const APPLY_MAILTO = "team@cypherpunk.io";

const HERO = "THE BITCOIN START-UP ENGINE";
const SCRAMBLE_CHARS = "01#/<>[]{}=$*+X▲◆·";

const NAV = [
  { id: "home", label: "Home" },
  { id: "accel", label: "Accel" },
  { id: "cos", label: "CoS" },
  { id: "hub", label: "Hub" },
  { id: "events", label: "Events" },
];

const PORTFOLIO = [
  { name: "SOVRN", teaser: "INHERITANCE", founder: "A. EDWARDS", tag: "Inheritance · non-custodial estate keys", img: "SOVRN" },
  { name: "SATPAY", teaser: "CONSUMER FINTECH", founder: "J. LOBOS", tag: "Consumer fintech · Lightning-native wallet", img: "SATPAY" },
  { name: "ENCLAVE", teaser: "CLOUD COMPUTING", founder: "A. FILINI", tag: "Cloud computing · sovereign compute nodes", img: "ENCLAVE" },
];

const VENTURE_IDEAS = ["Bitcoin-native payroll", "Self-custody for teams", "Lightning point-of-sale"];

const EVENTS = [
  { day: "02", title: "Pitching & Raising Capital Panel", where: "CYPHERPUNK Offices · 18:30" },
  { day: "10", title: "Building on Lightning Hackathon", where: "CYPHERPUNK Offices · All day" },
  { day: "19", title: "Women of Bitcoin Summit", where: "CYPHERPUNK Offices · 10:00" },
];

function mailtoHref(subject, body) {
  return `mailto:${APPLY_MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function CypherpunkApp() {
  const [screen, setScreen] = useState("home");
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyState, setApplyState] = useState("idle"); // idle | sending | sent
  const [subState, setSubState] = useState("idle");
  const [evtState, setEvtState] = useState("idle");
  const [form, setForm] = useState({ name: "", startup: "", stage: "Idea", building: "" });
  const [email, setEmail] = useState("");
  const [gsapReady, setGsapReady] = useState(false);

  const screenRef = useRef(null);
  const ctaRef = useRef(null);
  const heroRef = useRef(null);
  const heroDone = useRef(false);

  // Entrance stagger animation on every screen change (matches the design's
  // GSAP fromTo on [data-r] elements).
  useEffect(() => {
    if (!gsapReady || !window.gsap || !screenRef.current) return;
    const items = screenRef.current.querySelectorAll("[data-r]");
    if (!items.length) return;
    window.gsap.killTweensOf(items);
    window.gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05, overwrite: true, clearProps: "transform,opacity" }
    );
  }, [screen, gsapReady]);

  // Magnetic CTA (Home screen only), matching the design's cursor-follow effect.
  useEffect(() => {
    if (!gsapReady || screen !== "home" || !window.gsap || !ctaRef.current) return;
    const node = ctaRef.current;
    const g = window.gsap;
    const xTo = g.quickTo(node, "x", { duration: 0.45, ease: "power3" });
    const yTo = g.quickTo(node, "y", { duration: 0.45, ease: "power3" });
    const sTo = g.quickTo(node, "scale", { duration: 0.3, ease: "power3" });
    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      const r = node.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.55);
    };
    const onEnter = () => sTo(1.03);
    const onLeave = () => {
      xTo(0);
      yTo(0);
      sTo(1);
    };
    const onDown = () => sTo(0.96);
    const onUp = () => sTo(1.03);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);
    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointerup", onUp);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointerup", onUp);
    };
  }, [screen, gsapReady]);

  // Hero scramble/decode effect, once, on first mount.
  useEffect(() => {
    if (heroDone.current || !heroRef.current) return;
    heroDone.current = true;
    const node = heroRef.current;
    const dur = 820;
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const rev = Math.floor(p * HERO.length);
      let out = "";
      for (let i = 0; i < HERO.length; i++) {
        const ch = HERO[i];
        out += ch === " " || i < rev ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      node.textContent = out;
      if (p < 1) requestAnimationFrame(step);
      else node.textContent = HERO;
    }
    requestAnimationFrame(step);
  }, []);

  function openApply() {
    setApplyState("idle");
    setApplyOpen(true);
  }

  function submitApply(e) {
    e.preventDefault();
    if (applyState !== "idle") return;
    setApplyState("sending");
    const body = [
      `Founder name: ${form.name}`,
      `Startup: ${form.startup}`,
      `Stage: ${form.stage}`,
      `What are you building: ${form.building}`,
    ].join("\n");
    setTimeout(() => {
      window.location.href = mailtoHref("Founder application", body);
      setApplyState("sent");
    }, 500);
  }

  function subscribe() {
    if (subState === "idle") {
      window.location.href = mailtoHref("Newsletter signup", `Add me to the CYPHERPUNK newsletter.\n\nEmail: ${email}`);
      setSubState("done");
    }
  }

  function requestEventUpdates() {
    if (evtState === "idle") {
      window.location.href = mailtoHref("Event updates", "Notify me about upcoming CYPHERPUNK events.");
      setEvtState("done");
    }
  }

  const active = "var(--accent)";
  const idle = "var(--idle)";
  const applyLabel = applyState === "sending" ? "OPENING EMAIL…" : applyState === "sent" ? "EMAIL DRAFT OPENED ✓" : "SUBMIT APPLICATION";

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
        onLoad={() => setGsapReady(true)}
      />

      <div className="cp-shell">
        <StatusStrip />

        <div className="cp-content" ref={screenRef}>
          {screen === "home" && (
            <div className="cp-scroll cp-screen">
              <div style={{ marginTop: 44 }}>
                <div data-r className="eyebrow" style={{ marginBottom: 18 }}>
                  /// WELCOME TO CYPHERPUNK
                </div>
                <h1 data-r ref={heroRef} className="hero-h1">
                  {HERO}
                </h1>
                <p data-r className="hero-lede">
                  We invest in and build the next generation of Bitcoin unicorns.
                </p>
                <button ref={ctaRef} data-r className="btn-primary" onClick={openApply}>
                  <span>APPLY AS FOUNDER</span>
                  <span style={{ fontSize: 20 }}>&rarr;</span>
                </button>
              </div>

              <div data-r style={{ marginTop: 44 }}>
                <div className="label-faint" style={{ marginBottom: 14 }}>
                  BACKED BY
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="backer-card">Fulgur Ventures</div>
                  <div className="backer-card">Initial Capital</div>
                </div>
              </div>

              <p data-r className="lede-block">
                We help you do in <span style={{ color: "var(--accent)" }}>12 weeks</span> what usually
                takes a year &mdash; funding, technical resources, and high-level policy access to scale.
              </p>

              <div data-r style={{ marginTop: 40 }}>
                <div className="row-head">
                  <div className="label-faint">OUR COMPANIES</div>
                  <span className="link-cta" onClick={() => setScreen("cos")}>
                    VIEW ALL &rarr;
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {PORTFOLIO.map((c) => (
                    <div key={c.name} className="company-row" onClick={() => setScreen("cos")}>
                      <div>
                        <div className="company-name">{c.name}</div>
                        <div className="company-teaser">{c.teaser}</div>
                      </div>
                      <span style={{ color: "var(--accent)" }}>&#8599;</span>
                    </div>
                  ))}
                </div>
              </div>

              <div data-r className="hub-card" onClick={() => setScreen("hub")}>
                <div className="eyebrow">THE HUB</div>
                <div className="hub-card-title">The Right Room</div>
                <div className="hub-card-body">
                  Where Bitcoin&rsquo;s builders, investors, media and policymakers cross paths.
                </div>
                <span className="link-cta" style={{ marginTop: 14, display: "inline-flex", gap: 6 }}>
                  Learn more <span>&rarr;</span>
                </span>
              </div>

              <div data-r style={{ marginTop: 44 }}>
                <div className="hr" style={{ marginBottom: 22 }} />
                <div className="label-faint" style={{ marginBottom: 12 }}>
                  NEWSLETTER
                </div>
                <div className="newsletter-copy">Latest news, events and research from CYPHERPUNK.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    className="cp-input"
                    placeholder="you@proton.me"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="btn-outline btn-outline-sm" onClick={subscribe}>
                    {subState === "done" ? "OPENING…" : "SUBSCRIBE"}
                  </button>
                </div>
              </div>

              <div data-r style={{ marginTop: 36 }}>
                <div className="footer-address">
                  51-53 Hatton Garden
                  <br />
                  London EC1N 8HN
                </div>
                <div className="footer-email">team@cypherpunk.io</div>
                <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  {["X", "LinkedIn", "Substack", "TG"].map((s) => (
                    <span key={s} className="social-pill">
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>
                <div className="copyright">&copy; 2026 CYPHERPUNK &middot; &pound;1.00 = 100,000,000 sats</div>
              </div>
            </div>
          )}

          {screen === "accel" && (
            <div className="cp-scroll cp-screen">
              <div data-r className="eyebrow">
                01 /// ACCELERATOR
              </div>
              <h2 data-r className="screen-h2">
                12 Weeks to a Year
              </h2>
              <p data-r className="screen-lede">
                Everything an early-stage Bitcoin startup needs to scale &mdash; compressed into one
                cohort.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["01", "Funding", "Pre-seed cheque plus intros to Bitcoin-native funds and angels."],
                  ["02", "Technical Resources", "Lightning, Liquid and signing infra, plus protocol engineers on call."],
                  ["03", "Policy Access", "High-level access to regulators and the people shaping Bitcoin policy."],
                ].map(([num, title, body]) => (
                  <div key={num} data-r className="feature-card">
                    <div className="feature-num">{num}</div>
                    <div className="feature-title">{title}</div>
                    <div className="feature-body">{body}</div>
                  </div>
                ))}
              </div>

              <div data-r style={{ marginTop: 32 }}>
                <div className="label-faint" style={{ marginBottom: 8 }}>
                  THE 12 WEEKS
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    ["W 1–3", "Build & validate"],
                    ["W 4–8", "Ship to first users"],
                    ["W 9–11", "Raise the round"],
                    ["W 12", "Demo day"],
                  ].map(([wk, label], i, arr) => (
                    <div
                      key={wk}
                      className="timeline-row"
                      style={i === arr.length - 1 ? { borderBottom: "1px solid var(--border-soft)" } : undefined}
                    >
                      <span className="timeline-wk">{wk}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button data-r className="btn-primary" style={{ marginTop: 28 }} onClick={openApply}>
                <span>APPLY AS FOUNDER</span>
                <span style={{ fontSize: 20 }}>&rarr;</span>
              </button>
            </div>
          )}

          {screen === "cos" && (
            <div className="cp-scroll cp-screen">
              <div data-r className="eyebrow">
                02 /// OUR COMPANIES
              </div>
              <h2 data-r className="screen-h2" style={{ marginBottom: 26 }}>
                Portfolio
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {PORTFOLIO.map((c) => (
                  <div key={c.name} data-r className="portfolio-card">
                    <div className="portfolio-img">
                      <span className="img-label">[ IMG &middot; {c.img} ]</span>
                    </div>
                    <div className="portfolio-body">
                      <div className="row-head" style={{ alignItems: "baseline" }}>
                        <div className="portfolio-name">{c.name}</div>
                        <span className="portfolio-founder">FOUNDER &middot; {c.founder}</span>
                      </div>
                      <div className="portfolio-tag">{c.tag}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div data-r style={{ marginTop: 36 }}>
                <div className="label-faint" style={{ marginBottom: 6 }}>
                  VENTURE IDEAS
                </div>
                <p className="ideas-lede">Open problems we&rsquo;ll fund a founder to build.</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {VENTURE_IDEAS.map((idea, i, arr) => (
                    <div
                      key={idea}
                      className="idea-row"
                      style={i === arr.length - 1 ? { borderBottom: "1px solid var(--border-soft)" } : undefined}
                    >
                      <span style={{ fontSize: 14, color: "var(--text)" }}>{idea}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)" }}>OPEN</span>
                    </div>
                  ))}
                </div>
                <button className="btn-outline" style={{ marginTop: 20, width: "100%" }} onClick={openApply}>
                  PITCH AN IDEA &rarr;
                </button>
              </div>
            </div>
          )}

          {screen === "hub" && (
            <div className="cp-scroll cp-screen">
              <div data-r className="eyebrow">
                03 /// THE HUB
              </div>
              <h2 data-r className="screen-h2" style={{ marginBottom: 8 }}>
                The Right Room
              </h2>
              <p data-r className="screen-lede" style={{ marginBottom: 26 }}>
                Where Bitcoin&rsquo;s builders, investors, media and policymakers cross paths. The
                community is the product.
              </p>

              <div data-r className="hub-photo">
                <span className="img-label">[ IMG &middot; the co-working floor ]</span>
              </div>

              <div data-r className="amenities-grid">
                {["Coffee & tea", "Fast internet", "Conference rooms", "Key card access", "24/7 security", "Community events"].map(
                  (a) => (
                    <div key={a} className="amenity">
                      {a}
                    </div>
                  )
                )}
              </div>

              <div data-r className="meeting-card">
                <div className="row-head" style={{ alignItems: "center" }}>
                  <div className="meeting-title">Meeting rooms</div>
                  <span className="bookable">&#9679; BOOKABLE</span>
                </div>
                <div className="meeting-body">Reserve by the hour, paid in sats. Key-card entry, 24/7.</div>
              </div>

              <button data-r className="btn-primary" style={{ marginTop: 24 }} onClick={openApply}>
                <span>BECOME A MEMBER</span>
                <span style={{ fontSize: 20 }}>&rarr;</span>
              </button>
            </div>
          )}

          {screen === "events" && (
            <div className="cp-scroll cp-screen">
              <div data-r className="eyebrow">
                04 /// EVENTS
              </div>
              <h2 data-r className="screen-h2" style={{ marginBottom: 8 }}>
                Gather with the Vanguard
              </h2>
              <p data-r className="screen-lede" style={{ marginBottom: 26 }}>
                Deep-dives, hackathons and demo days with the brightest minds in Bitcoin.
              </p>

              <div data-r className="label-faint" style={{ marginBottom: 4 }}>
                FEBRUARY
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {EVENTS.map((e, i, arr) => (
                  <div
                    key={e.title}
                    data-r
                    className="event-row"
                    style={i === arr.length - 1 ? { borderBottom: "1px solid var(--border-soft)" } : undefined}
                  >
                    <div style={{ textAlign: "center", minWidth: 40 }}>
                      <div className="event-day">{e.day}</div>
                      <div className="event-month">FEB</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="event-title">{e.title}</div>
                      <div className="event-where">{e.where}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button data-r className="btn-outline" style={{ marginTop: 26, width: "100%" }} onClick={requestEventUpdates}>
                {evtState === "done" ? "OPENING…" : "UPCOMING EVENTS →"}
              </button>
            </div>
          )}
        </div>

        {applyOpen && (
          <div className="cp-modal-backdrop" onClick={() => setApplyOpen(false)}>
            <div className="cp-sheet" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                <div className="cp-sheet-handle" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="eyebrow">/// FOUNDER APPLICATION</div>
                  <div className="sheet-title">Apply as Founder</div>
                </div>
                <button className="sheet-close" onClick={() => setApplyOpen(false)} aria-label="Close">
                  &#10005;
                </button>
              </div>

              <form onSubmit={submitApply} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <label className="field-label">
                  FOUNDER NAME *
                  <input
                    required
                    className="cp-input"
                    style={{ marginTop: 8, width: "100%" }}
                    placeholder="Satoshi Nakamoto"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>
                <label className="field-label">
                  STARTUP *
                  <input
                    required
                    className="cp-input"
                    style={{ marginTop: 8, width: "100%" }}
                    placeholder="Working name"
                    value={form.startup}
                    onChange={(e) => setForm((f) => ({ ...f, startup: e.target.value }))}
                  />
                </label>
                <label className="field-label">
                  STAGE
                  <select
                    className="cp-input"
                    style={{ marginTop: 8, width: "100%" }}
                    value={form.stage}
                    onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}
                  >
                    <option>Idea</option>
                    <option>Pre-seed</option>
                    <option>Seed</option>
                  </select>
                </label>
                <label className="field-label">
                  WHAT ARE YOU BUILDING?
                  <textarea
                    rows={2}
                    className="cp-input"
                    style={{ marginTop: 8, width: "100%", resize: "none" }}
                    placeholder="one line, no marketing"
                    value={form.building}
                    onChange={(e) => setForm((f) => ({ ...f, building: e.target.value }))}
                  />
                </label>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    marginTop: 6,
                    justifyContent: "center",
                    background: applyState === "sent" ? "var(--good)" : "var(--accent)",
                  }}
                >
                  <span>{applyLabel}</span>
                </button>
                <div className="sheet-footnote">12-WEEK COHORT &middot; LONDON &middot; SATS-DENOMINATED</div>
              </form>
            </div>
          </div>
        )}

        <div className="cp-nav">
          {NAV.map((item) => (
            <button key={item.id} className="cp-nav-btn" onClick={() => setScreen(item.id)}>
              <NavIcon id={item.id} color={screen === item.id ? active : idle} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.05em", color: screen === item.id ? active : idle }}>
                {item.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .cp-shell {
          max-width: 460px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .cp-content {
          flex: 1;
          min-height: 0;
          position: relative;
        }
        .cp-screen {
          height: 100%;
          padding: 26px 24px 40px;
        }
        .cp-scroll {
          overflow-y: auto;
        }
        .hr {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
        }
        .hero-h1 {
          margin: 0;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(32px, 8vw, 42px);
          line-height: 0.98;
          letter-spacing: -0.03em;
          color: var(--text);
          text-wrap: balance;
          min-height: 100px;
        }
        .hero-lede {
          margin: 20px 0 0;
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-dim);
          max-width: 320px;
        }
        .lede-block {
          margin: 40px 0 0;
          font-size: 20px;
          line-height: 1.4;
          color: var(--text);
          letter-spacing: -0.01em;
          text-wrap: balance;
        }
        .btn-primary {
          margin-top: 26px;
          width: 100%;
          background: var(--accent);
          color: #0a0a0b;
          border: none;
          border-radius: 12px;
          padding: 18px 20px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .btn-primary:hover {
          background: var(--accent-hover);
        }
        .btn-outline {
          background: none;
          color: var(--accent);
          border: 1px solid var(--accent-border);
          border-radius: 12px;
          padding: 15px;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.04em;
          cursor: pointer;
        }
        .btn-outline:hover {
          background: rgba(247, 147, 26, 0.1);
        }
        .btn-outline-sm {
          padding: 0 16px;
          font-size: 11px;
          border-radius: 10px;
          white-space: nowrap;
        }
        .backer-card {
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 14px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: var(--text);
        }
        .row-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 16px;
          gap: 10px;
        }
        .link-cta {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--accent);
          cursor: pointer;
          white-space: nowrap;
        }
        .company-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-top: 1px solid var(--border-soft);
          cursor: pointer;
        }
        .company-name {
          font-weight: 600;
          font-size: 16px;
          color: var(--text);
        }
        .company-teaser {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-faint);
          margin-top: 3px;
        }
        .hub-card {
          margin-top: 40px;
          border: 1px solid var(--accent-border);
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          background: var(--accent-tint);
        }
        .hub-card-title {
          font-weight: 600;
          font-size: 22px;
          color: var(--text);
          margin-top: 8px;
          letter-spacing: -0.01em;
        }
        .hub-card-body {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
          margin-top: 8px;
          line-height: 1.55;
        }
        .newsletter-copy {
          font-size: 13px;
          color: var(--text-dim);
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .cp-input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 12px;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 12px;
          outline: none;
          flex: 1;
          min-width: 0;
        }
        .cp-input:focus {
          border-color: var(--accent);
        }
        .footer-address {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text);
          line-height: 1.7;
        }
        .footer-email {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--accent);
          margin-top: 8px;
        }
        .social-pill {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-faint);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 20px;
          padding: 6px 12px;
        }
        .copyright {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-mute);
          margin-top: 18px;
          letter-spacing: 0.06em;
        }
        .screen-h2 {
          margin: 12px 0 8px;
          font-weight: 600;
          font-size: clamp(28px, 6vw, 34px);
          line-height: 1;
          letter-spacing: -0.025em;
          color: var(--text);
        }
        .screen-lede {
          margin: 0 0 30px;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-dim);
        }
        .feature-card {
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
        }
        .feature-num {
          font-family: var(--font-mono);
          font-size: 20px;
          color: var(--accent);
          font-weight: 700;
        }
        .feature-title {
          font-weight: 600;
          font-size: 18px;
          color: var(--text);
          margin-top: 8px;
        }
        .feature-body {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
          margin-top: 6px;
          line-height: 1.55;
        }
        .timeline-row {
          display: flex;
          gap: 16px;
          padding: 13px 0;
          border-top: 1px solid var(--border-soft);
        }
        .timeline-wk {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--accent);
          min-width: 56px;
        }
        .portfolio-card {
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }
        .portfolio-img {
          aspect-ratio: 16 / 9;
          background: repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0 12px, rgba(255, 255, 255, 0.015) 12px 24px);
          display: flex;
          align-items: flex-end;
          padding: 12px;
        }
        .img-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-faint);
        }
        .portfolio-body {
          padding: 16px;
        }
        .portfolio-name {
          font-weight: 600;
          font-size: 19px;
          color: var(--text);
        }
        .portfolio-founder {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--accent);
          white-space: nowrap;
        }
        .portfolio-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
          margin-top: 6px;
        }
        .ideas-lede {
          margin: 0 0 8px;
          font-size: 13px;
          color: var(--text-dim);
          line-height: 1.5;
        }
        .idea-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-top: 1px solid var(--border-soft);
        }
        .hub-photo {
          overflow: hidden;
          border-radius: 14px;
          margin-bottom: 24px;
          aspect-ratio: 16 / 10;
          background: repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0 12px, rgba(255, 255, 255, 0.015) 12px 24px);
          display: flex;
          align-items: flex-end;
          padding: 14px;
        }
        .amenities-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px 0;
        }
        .amenity {
          padding: 15px 0;
          border-top: 1px solid var(--border-soft);
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text);
        }
        .meeting-card {
          margin-top: 26px;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
        }
        .meeting-title {
          font-weight: 600;
          font-size: 16px;
          color: var(--text);
        }
        .bookable {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--good);
          white-space: nowrap;
        }
        .meeting-body {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
          margin-top: 6px;
          line-height: 1.55;
        }
        .event-row {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding: 18px 0;
          border-top: 1px solid var(--border-soft);
        }
        .event-day {
          font-weight: 700;
          font-size: 22px;
          color: var(--accent);
          line-height: 1;
        }
        .event-month {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-faint);
        }
        .event-title {
          font-weight: 600;
          font-size: 16px;
          color: var(--text);
          line-height: 1.25;
        }
        .event-where {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-faint);
          margin-top: 5px;
        }
        .cp-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 70;
          background: rgba(4, 4, 5, 0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .cp-sheet {
          width: 100%;
          max-width: 460px;
          max-height: 92vh;
          overflow-y: auto;
          background: var(--surface);
          border-top: 1px solid var(--accent-border);
          border-radius: 26px 26px 0 0;
          padding: 20px 24px 30px;
        }
        .cp-sheet-handle {
          width: 40px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.18);
        }
        .sheet-title {
          font-weight: 600;
          font-size: 23px;
          color: var(--text);
          margin-top: 8px;
          letter-spacing: -0.02em;
        }
        .sheet-close {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: var(--text);
          width: 34px;
          height: 34px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
        }
        .field-label {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-faint);
          letter-spacing: 0.04em;
          display: block;
        }
        .sheet-footnote {
          margin-top: 14px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--text-mute);
          text-align: center;
          letter-spacing: 0.03em;
          line-height: 1.6;
        }
        .cp-nav {
          position: sticky;
          bottom: 0;
          background: rgba(10, 10, 11, 0.86);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 12px 8px 16px;
          z-index: 65;
        }
        .cp-nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 6px 3px;
        }
        @media (max-width: 400px) {
          .cp-screen { padding: 24px 18px 36px; }
        }
      `}</style>
    </>
  );
}

function NavIcon({ id, color }) {
  switch (id) {
    case "home":
      return <span style={{ width: 15, height: 15, border: `1.6px solid ${color}`, borderRadius: 3 }} />;
    case "accel":
      return (
        <span
          style={{
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: `14px solid ${color}`,
          }}
        />
      );
    case "cos":
      return <span style={{ width: 14, height: 14, border: `1.6px solid ${color}`, transform: "rotate(45deg)" }} />;
    case "hub":
      return <span style={{ width: 15, height: 15, border: `1.6px solid ${color}`, borderRadius: "50%" }} />;
    case "events":
      return (
        <span style={{ width: 15, height: 11, border: `1.6px solid ${color}`, borderRadius: 2, position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", top: -4, left: 2, width: 1.6, height: 4, background: color }} />
          <span style={{ position: "absolute", top: -4, right: 2, width: 1.6, height: 4, background: color }} />
        </span>
      );
    default:
      return null;
  }
}
