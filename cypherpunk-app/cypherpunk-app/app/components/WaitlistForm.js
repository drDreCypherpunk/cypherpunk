"use client";

import { useState } from "react";

// TODO: replace with a real waitlist address once a capture backend exists
// (see content/campaign.json -> waitlist.note). Until then this only opens
// a pre-filled mailto: draft in the visitor's own mail client.
const WAITLIST_MAILTO = "waitlist@example.com";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sent | error

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      return;
    }

    const subject = "CYPHERPUNK App waitlist";
    const body = `Add me to the CYPHERPUNK App waitlist.\n\nEmail: ${trimmed}`;
    const mailto = `mailto:${WAITLIST_MAILTO}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatus("sent");
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
      <div className="waitlist-row">
        <label htmlFor="waitlist-email" className="visually-hidden">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          autoComplete="email"
        />
        <button type="submit">Join waitlist</button>
      </div>

      <p className="waitlist-note">
        There&rsquo;s no signup backend yet, so this opens a pre-filled email
        draft in your mail client instead of submitting anywhere. We&rsquo;ll
        swap this for a real endpoint before launch.
      </p>

      {status === "error" && (
        <p className="waitlist-status waitlist-status--error" role="alert">
          Enter an email address first.
        </p>
      )}
      {status === "sent" && (
        <p className="waitlist-status waitlist-status--ok" role="status">
          Opening your mail client&hellip; if nothing happened, email us
          directly at {WAITLIST_MAILTO}.
        </p>
      )}

      <style jsx>{`
        .waitlist-form {
          margin-top: 20px;
        }

        .waitlist-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        input[type="email"] {
          flex: 1 1 240px;
          min-width: 0;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          color: var(--text);
          padding: 12px 14px;
          border-radius: 4px;
          font-size: 14px;
        }

        input[type="email"]:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        input[type="email"]::placeholder {
          color: var(--text-faint);
        }

        button[type="submit"] {
          background: var(--accent);
          color: var(--bg);
          border: 1px solid var(--accent);
          padding: 12px 18px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
        }

        button[type="submit"]:hover {
          filter: brightness(1.08);
        }

        button[type="submit"]:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .waitlist-note {
          margin: 10px 0 0;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-faint);
          line-height: 1.5;
        }

        .waitlist-status {
          margin: 8px 0 0;
          font-family: var(--font-mono);
          font-size: 12px;
        }

        .waitlist-status--error {
          color: var(--critical);
        }

        .waitlist-status--ok {
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
