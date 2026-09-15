"use client";

import { useState } from "react";

// TODO: replace with a real newsletter provider (Substack has its own embed,
// or a proper ESP) once one is wired up — this only opens a mailto draft.
const NEWSLETTER_MAILTO = "team@cypherpunk.io";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      return;
    }
    const subject = "Newsletter signup";
    const body = `Add me to the CYPHERPUNK newsletter.\n\nEmail: ${trimmed}`;
    window.location.href = `mailto:${NEWSLETTER_MAILTO}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <div className="newsletter-row">
        <label htmlFor="newsletter-email" className="visually-hidden">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="you@proton.me"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          autoComplete="email"
        />
        <button type="submit">Subscribe</button>
      </div>
      {status === "error" && (
        <p className="newsletter-status newsletter-status--error" role="alert">
          Enter an email address first.
        </p>
      )}
      {status === "sent" && (
        <p className="newsletter-status newsletter-status--ok" role="status">
          Opening your mail client&hellip; no signup backend yet, so this
          drafts an email to {NEWSLETTER_MAILTO} instead.
        </p>
      )}
      <style jsx>{`
        .newsletter-form {
          margin-top: 14px;
        }
        .newsletter-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        input[type="email"] {
          flex: 1 1 200px;
          min-width: 0;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          color: var(--text);
          padding: 12px 14px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 13px;
        }
        input[type="email"]::placeholder {
          color: var(--text-faint);
        }
        input[type="email"]:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        button[type="submit"] {
          background: transparent;
          color: var(--accent);
          border: 1px solid var(--accent);
          padding: 12px 18px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: var(--font-mono);
          cursor: pointer;
          white-space: nowrap;
        }
        button[type="submit"]:hover {
          background: var(--accent-soft);
        }
        .newsletter-status {
          margin: 8px 0 0;
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .newsletter-status--error {
          color: var(--critical);
        }
        .newsletter-status--ok {
          color: var(--good);
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </form>
  );
}
