"use client";

import { useEffect, useState } from "react";

// A small, honest brand flourish: real Bitcoin network stats (block height,
// sat/vB fee), not decorative fake data. Falls back to a static brand
// message if the public API is unreachable — never shows a stale number
// as if it were live.
const MESSAGES_BASE = ["CYPHERPUNK · LIVE"];

export default function StatusTicker() {
  const [blockHeight, setBlockHeight] = useState(null);
  const [feeRate, setFeeRate] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [heightRes, feeRes] = await Promise.all([
          fetch("https://mempool.space/api/blocks/tip/height"),
          fetch("https://mempool.space/api/v1/fees/recommended"),
        ]);
        if (!heightRes.ok || !feeRes.ok) throw new Error("bad response");
        const height = await heightRes.text();
        const fees = await feeRes.json();
        if (!cancelled) {
          setBlockHeight(Number(height).toLocaleString());
          setFeeRate(fees.halfHourFee ?? fees.hourFee ?? null);
        }
      } catch {
        // Network unreachable or blocked — degrade to the static message,
        // never show a fabricated number.
      }
    }

    load();
    const refresh = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, []);

  const messages = [
    ...MESSAGES_BASE,
    blockHeight ? `BLK HGT ${blockHeight}` : null,
    feeRate ? `SAT/VB ${feeRate}` : null,
  ].filter(Boolean);

  useEffect(() => {
    const rotate = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(rotate);
  }, [messages.length]);

  return (
    <div className="status-ticker">
      <div className="wrap status-ticker-inner">
        <span className="status-brand">CYPHERPUNK</span>
        <span className="status-live">
          <span className="status-dot" aria-hidden="true" />
          <span className="status-message">{messages[index % messages.length]}</span>
        </span>
      </div>
      <style jsx>{`
        .status-ticker {
          position: sticky;
          top: 0;
          z-index: 30;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }
        .status-ticker-inner {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
        }
        .status-brand {
          color: var(--text-dim);
          font-weight: 600;
        }
        .status-live {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--text-faint);
          font-variant-numeric: tabular-nums;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--good);
          box-shadow: 0 0 0 3px var(--good-soft);
          flex-shrink: 0;
        }
        .status-message {
          min-width: 120px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
