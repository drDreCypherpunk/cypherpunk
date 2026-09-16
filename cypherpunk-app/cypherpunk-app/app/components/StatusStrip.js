"use client";

import { useEffect, useRef, useState } from "react";

// Real Bitcoin network data (mempool.space's public API), not the design
// mock's simulated random-walk numbers. Cycles through the same 4 states
// the design specifies, at the same cadence, but every number shown is
// live. Degrades to the brand message alone if the fetch fails.
export default function StatusStrip() {
  const [gbp, setGbp] = useState(null);
  const [block, setBlock] = useState(null);
  const [feeRate, setFeeRate] = useState(null);
  const [tickIdx, setTickIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const elRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [priceRes, heightRes, feeRes] = await Promise.all([
          fetch("https://mempool.space/api/v1/prices"),
          fetch("https://mempool.space/api/blocks/tip/height"),
          fetch("https://mempool.space/api/v1/fees/recommended"),
        ]);
        if (!priceRes.ok || !heightRes.ok || !feeRes.ok) throw new Error("bad response");
        const prices = await priceRes.json();
        const height = await heightRes.text();
        const fees = await feeRes.json();
        if (!cancelled) {
          if (prices.GBP) setGbp(Math.round(prices.GBP));
          setBlock(Number(height));
          setFeeRate(fees.halfHourFee ?? fees.hourFee ?? null);
        }
      } catch {
        // Network unreachable — degrade to the brand-only message below,
        // never show a stale or fabricated number.
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
    gbp != null && (
      <>
        GBP/BTC <span style={{ color: "var(--accent)" }}>&pound;{gbp.toLocaleString("en-GB")}</span>
      </>
    ),
    block != null && (
      <>
        BLK HGT <span style={{ color: "var(--text)" }}>{block.toLocaleString("en-US")}</span>
      </>
    ),
    feeRate != null && (
      <>
        SAT/VB <span style={{ color: "var(--text)" }}>{feeRate}</span>
      </>
    ),
    (
      <>
        CYPHERPUNK <span style={{ color: "var(--good)" }}>&#9679; LIVE</span>
      </>
    ),
  ].filter(Boolean);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTickIdx((i) => (i + 1) % messages.length);
        setVisible(true);
      }, 350);
    }, 2600);
    return () => clearInterval(cycle);
  }, [messages.length]);

  return (
    <div className="status-strip">
      <div className="status-row">
        <span className="status-brand">CYPHERPUNK</span>
        <span className="status-satlink">
          <span className="status-dot" aria-hidden="true">
            &#9679;
          </span>
          SAT-LINK
        </span>
      </div>
      <div className="status-tick" ref={elRef} style={{ opacity: visible ? 1 : 0 }}>
        {messages[tickIdx % messages.length]}
      </div>
      <div className="status-rule" />

      <style jsx>{`
        .status-strip {
          position: sticky;
          top: 0;
          z-index: 40;
          background: var(--bg);
        }
        .status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px clamp(20px, 4vw, 40px) 8px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--text);
          font-weight: 500;
        }
        .status-brand {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--text-faint);
        }
        .status-satlink {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 10px;
          color: var(--text-faint);
        }
        .status-dot {
          color: var(--good);
          font-size: 8px;
        }
        .status-tick {
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.04em;
          font-weight: 500;
          color: var(--text-dim);
          transition: opacity 0.35s ease;
        }
        .status-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
        }
      `}</style>
    </div>
  );
}
