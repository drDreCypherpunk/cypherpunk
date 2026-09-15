"use client";

import { useEffect, useMemo, useState } from "react";
import { checkPassphrase, isAuthed, markAuthed, signOut } from "../../lib/auth";
import { verifyToken, getJsonFile, putJsonFile } from "../../lib/github";

const TOKEN_KEY = "cypherpunk_gh_token";

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

function StatusPill({ status }) {
  const meta = {
    done: { label: "Done", fg: "var(--good)", bg: "var(--good-soft)" },
    in_progress: { label: "In progress", fg: "var(--warning)", bg: "var(--warning-soft)" },
    not_started: { label: "Not started", fg: "var(--text-faint)", bg: "var(--surface-2)" },
  }[status] || { label: status, fg: "var(--text-faint)", bg: "var(--surface-2)" };

  return (
    <span className="pill" style={{ color: meta.fg, background: meta.bg }}>
      {meta.label}
      <style jsx>{`
        .pill {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 3px;
          white-space: nowrap;
        }
      `}</style>
    </span>
  );
}

function StatTile({ label, value, sub }) {
  return (
    <div className="tile">
      <div className="tile-label">{label}</div>
      <div className="tile-value">{value}</div>
      {sub && <div className="tile-sub">{sub}</div>}
      <style jsx>{`
        .tile {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 14px 16px;
          min-width: 0;
        }
        .tile-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-bottom: 6px;
        }
        .tile-value {
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          overflow-wrap: anywhere;
        }
        .tile-sub {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-dim);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

function PassphraseGate({ onSuccess }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      const ok = await checkPassphrase(value);
      if (ok) {
        markAuthed();
        onSuccess();
      } else {
        setError("Incorrect passphrase.");
      }
    } catch (err) {
      setError(err.message || "Could not check passphrase.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={handleSubmit}>
        <div className="eyebrow">Admin access</div>
        <h1>CYPHERPUNK ops console</h1>
        <label htmlFor="pass" className="field-label">
          Passphrase
        </label>
        <input
          id="pass"
          type="password"
          autoFocus
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={checking || !value}>
          {checking ? "Checking…" : "Enter"}
        </button>
        <p className="note">
          This passphrase only gates the UI, not the data — real protection is
          your own GitHub token, per lib/auth.js&rsquo;s documented model.
        </p>
      </form>
      <style jsx>{`
        .gate {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .gate-card {
          width: 100%;
          max-width: 360px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 28px 24px;
        }
        h1 {
          font-size: 18px;
          margin: 6px 0 20px;
        }
        .field-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 6px;
        }
        input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border-strong);
          color: var(--text);
          padding: 10px 12px;
          border-radius: 4px;
          font-size: 14px;
        }
        input:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 1px;
        }
        .error {
          color: var(--critical);
          font-family: var(--font-mono);
          font-size: 12px;
          margin: 10px 0 0;
        }
        button {
          width: 100%;
          margin-top: 16px;
          background: var(--accent);
          color: var(--bg);
          border: 1px solid var(--accent);
          padding: 10px 14px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        button:not(:disabled):hover {
          filter: brightness(1.08);
        }
        .note {
          margin: 16px 0 0;
          font-family: var(--font-mono);
          font-size: 11px;
          line-height: 1.5;
          color: var(--text-faint);
        }
      `}</style>
    </div>
  );
}

function TokenGate({ onSuccess }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      await verifyToken(value.trim());
      window.localStorage.setItem(TOKEN_KEY, value.trim());
      onSuccess(value.trim());
    } catch (err) {
      setError(err.message || "Could not verify token.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={handleSubmit}>
        <div className="eyebrow">Step 2 of 2</div>
        <h1>Connect a GitHub token</h1>
        <p className="lead">
          Paste a personal access token with repo-scoped access (or a
          fine-grained token with Contents read/write on this repo). It&rsquo;s
          stored only in this browser&rsquo;s localStorage — never sent
          anywhere except api.github.com.
        </p>
        <label htmlFor="token" className="field-label">
          GitHub token
        </label>
        <input
          id="token"
          type="password"
          autoFocus
          autoComplete="off"
          placeholder="ghp_… or github_pat_…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={checking || !value.trim()}>
          {checking ? "Verifying…" : "Verify & continue"}
        </button>
      </form>
      <style jsx>{`
        .gate {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .gate-card {
          width: 100%;
          max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 28px 24px;
        }
        h1 {
          font-size: 18px;
          margin: 6px 0 12px;
        }
        .lead {
          font-size: 13px;
          color: var(--text-dim);
          margin: 0 0 18px;
          line-height: 1.5;
        }
        .field-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 6px;
        }
        input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border-strong);
          color: var(--text);
          padding: 10px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-family: var(--font-mono);
        }
        input:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 1px;
        }
        .error {
          color: var(--critical);
          font-family: var(--font-mono);
          font-size: 12px;
          margin: 10px 0 0;
          line-height: 1.5;
        }
        button {
          width: 100%;
          margin-top: 16px;
          background: var(--accent);
          color: var(--bg);
          border: 1px solid var(--accent);
          padding: 10px 14px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        button:not(:disabled):hover {
          filter: brightness(1.08);
        }
      `}</style>
    </div>
  );
}

function Dashboard({ token, onSignOut }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [data, setData] = useState(null);
  const [sha, setSha] = useState(null);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error | conflict
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const result = await getJsonFile("content/campaign.json", token);
        if (cancelled) return;
        if (!result.data) {
          setLoadError(
            "content/campaign.json wasn't found in this repo/branch — check NEXT_PUBLIC_GH_OWNER/REPO/BRANCH."
          );
        } else {
          setData(result.data);
          setSha(result.sha);
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message || "Failed to load campaign data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const weeksByPhase = useMemo(() => {
    if (!data) return [];
    return data.phases.map((phase) => ({
      phase,
      weeks: data.weeks.filter(
        (w) => w.week >= phase.weeks[0] && w.week <= phase.weeks[1]
      ),
    }));
  }, [data]);

  const weeksCompleted = useMemo(() => {
    if (!data) return 0;
    return data.weeks.filter((w) => w.status === "done").length;
  }, [data]);

  const currentPhase = useMemo(() => {
    if (!data) return null;
    const firstUnfinished = data.weeks.find((w) => w.status !== "done");
    const activeWeek = firstUnfinished ? firstUnfinished.week : data.weeks.length;
    return (
      data.phases.find(
        (p) => activeWeek >= p.weeks[0] && activeWeek <= p.weeks[1]
      ) || data.phases[data.phases.length - 1]
    );
  }, [data]);

  function updateActual(field, raw) {
    const n = raw === "" ? 0 : Number(raw);
    setData((d) => ({ ...d, actuals: { ...d.actuals, [field]: Number.isNaN(n) ? 0 : n } }));
  }

  function updateWeekStatus(week, status) {
    setData((d) => ({
      ...d,
      weeks: d.weeks.map((w) => (w.week === week ? { ...w, status } : w)),
    }));
  }

  async function handleSave() {
    if (!data) return;
    setSaveState("saving");
    setSaveError("");
    const payload = { ...data, updatedAt: new Date().toISOString() };
    try {
      const result = await putJsonFile("content/campaign.json", payload, {
        token,
        sha,
        message: "Update campaign data via admin dashboard",
      });
      setData(payload);
      if (result && result.content && result.content.sha) {
        setSha(result.content.sha);
      }
      setSaveState("saved");
      setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 3000);
    } catch (err) {
      const conflict = /reload the dashboard/i.test(err.message || "");
      setSaveState(conflict ? "conflict" : "error");
      setSaveError(err.message || "Failed to save changes.");
    }
  }

  function handleSignOut() {
    signOut();
    window.localStorage.removeItem(TOKEN_KEY);
    onSignOut();
  }

  return (
    <div className="dash">
      <header className="dash-header">
        <div>
          <div className="eyebrow">Cypherpunk Private Limited</div>
          <h1>Campaign ops console</h1>
        </div>
        <button className="signout" onClick={handleSignOut} type="button">
          Sign out / clear token
        </button>
      </header>

      {loading && <p className="status-line">Loading campaign.json…</p>}

      {!loading && loadError && (
        <div className="load-error">
          <strong>Couldn&rsquo;t load campaign data.</strong>
          <p>{loadError}</p>
        </div>
      )}

      {!loading && !loadError && data && (
        <>
          <section className="stats">
            <StatTile
              label="Visits"
              value={data.actuals.visits.toLocaleString()}
              sub={`of ${data.targets.visits.toLocaleString()} target`}
            />
            <StatTile
              label="Leads"
              value={data.actuals.leads.toLocaleString()}
              sub={`of ${data.targets.leads.toLocaleString()} target`}
            />
            <StatTile
              label="Current phase"
              value={currentPhase ? currentPhase.name : "—"}
              sub={
                currentPhase
                  ? `weeks ${currentPhase.weeks[0]}–${currentPhase.weeks[1]}`
                  : ""
              }
            />
            <StatTile
              label="Weeks completed"
              value={`${weeksCompleted} / ${data.weeks.length}`}
            />
          </section>

          <section className="panel">
            <h2>Actuals</h2>
            <div className="actuals-row">
              <label>
                <span className="field-label">Visits</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={data.actuals.visits}
                  onChange={(e) => updateActual("visits", e.target.value)}
                />
              </label>
              <label>
                <span className="field-label">Leads</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={data.actuals.leads}
                  onChange={(e) => updateActual("leads", e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="panel">
            <h2>24-week plan</h2>
            <div className="table-scroll">
              {weeksByPhase.map(({ phase, weeks }) => (
                <div className="phase-block" key={phase.id}>
                  <div className="phase-heading">
                    <span className="phase-name">{phase.name}</span>
                    <span className="phase-meta">
                      weeks {phase.weeks[0]}–{phase.weeks[1]} · exit target{" "}
                      {phase.exitTargetVisits.toLocaleString()} visits
                    </span>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th className="col-week">Wk</th>
                        <th>Title</th>
                        <th className="col-status">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeks.map((w) => (
                        <tr key={w.week}>
                          <td className="col-week">{w.week}</td>
                          <td>{w.title}</td>
                          <td className="col-status">
                            <div className="status-cell">
                              <StatusPill status={w.status} />
                              <select
                                value={w.status}
                                onChange={(e) =>
                                  updateWeekStatus(w.week, e.target.value)
                                }
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>

          <section className="save-bar">
            <div className="save-controls">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveState === "saving"}
              >
                {saveState === "saving" ? "Saving…" : "Save changes"}
              </button>
              {saveState === "saved" && (
                <span className="save-msg save-msg--ok">Saved.</span>
              )}
              {(saveState === "error" || saveState === "conflict") && (
                <span className="save-msg save-msg--error" role="alert">
                  {saveError}
                </span>
              )}
            </div>
            <p className="deploy-note">
              Pushing to <code>main</code> triggers the GitHub Pages deploy
              workflow, so changes go live in about a minute or two.
            </p>
          </section>
        </>
      )}

      <style jsx>{`
        .dash {
          max-width: 1080px;
          margin: 0 auto;
          padding: 24px 20px 64px;
        }
        .dash-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        h1 {
          font-size: 20px;
          margin-top: 4px;
        }
        .signout {
          background: transparent;
          border: 1px solid var(--border-strong);
          color: var(--text-dim);
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
        }
        .signout:hover {
          border-color: var(--critical);
          color: var(--critical);
        }
        .status-line {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--text-dim);
        }
        .load-error {
          background: var(--critical-soft);
          border: 1px solid var(--critical);
          border-radius: 6px;
          padding: 14px 16px;
          color: var(--text);
        }
        .load-error p {
          margin: 6px 0 0;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-dim);
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-bottom: 28px;
        }
        .panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 18px 18px 20px;
          margin-bottom: 20px;
        }
        .panel h2 {
          font-size: 13px;
          font-family: var(--font-mono);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 14px;
        }
        .actuals-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .actuals-row label {
          display: block;
        }
        .field-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-bottom: 6px;
        }
        .actuals-row input {
          background: var(--surface-2);
          border: 1px solid var(--border-strong);
          color: var(--text);
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          padding: 8px 10px;
          border-radius: 4px;
          font-size: 14px;
          width: 160px;
          max-width: 100%;
        }
        .actuals-row input:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 1px;
        }
        .table-scroll {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .phase-block {
          overflow-x: auto;
        }
        .phase-heading {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .phase-name {
          font-weight: 600;
          font-size: 14px;
        }
        .phase-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        table {
          width: 100%;
          min-width: 420px;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-faint);
          border-bottom: 1px solid var(--border);
          padding: 6px 8px;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
          vertical-align: middle;
        }
        .col-week {
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          color: var(--text-dim);
          width: 40px;
        }
        .col-status {
          width: 190px;
        }
        .status-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        select {
          background: var(--surface-2);
          border: 1px solid var(--border-strong);
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 4px 6px;
          border-radius: 4px;
        }
        .save-bar {
          position: sticky;
          bottom: 0;
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 16px 0 0;
          margin-top: 8px;
        }
        .save-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .save-controls button {
          background: var(--accent);
          color: var(--bg);
          border: 1px solid var(--accent);
          padding: 10px 18px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        .save-controls button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .save-controls button:not(:disabled):hover {
          filter: brightness(1.08);
        }
        .save-msg {
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .save-msg--ok {
          color: var(--good);
        }
        .save-msg--error {
          color: var(--critical);
        }
        .deploy-note {
          margin: 10px 0 0;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .deploy-note code {
          color: var(--text-dim);
        }
      `}</style>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    setAuthed(isAuthed());
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    try {
      setToken(window.localStorage.getItem(TOKEN_KEY));
    } catch {
      setToken(null);
    }
    setTokenChecked(true);
  }, [authed]);

  if (!authChecked) {
    return <div className="wrap" style={{ paddingTop: 40 }} />;
  }

  if (!authed) {
    return <PassphraseGate onSuccess={() => setAuthed(true)} />;
  }

  if (!tokenChecked) {
    return <div className="wrap" style={{ paddingTop: 40 }} />;
  }

  if (!token) {
    return <TokenGate onSuccess={(t) => setToken(t)} />;
  }

  return (
    <Dashboard
      token={token}
      onSignOut={() => {
        setAuthed(false);
        setToken(null);
        setTokenChecked(false);
      }}
    />
  );
}
