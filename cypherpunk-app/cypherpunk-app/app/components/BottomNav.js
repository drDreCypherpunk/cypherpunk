"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  { id: "home", label: "Home", icon: "square" },
  { id: "accelerator", label: "Accel", icon: "triangle" },
  { id: "portfolio", label: "CoS", icon: "diamond" },
  { id: "hub", label: "Hub", icon: "circle" },
  { id: "events", label: "Events", icon: "calendar" },
];

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 18 18", fill: "none" };
  switch (name) {
    case "square":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "triangle":
      return (
        <svg {...common}>
          <path d="M9 3L15.5 15H2.5L9 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...common}>
          <path d="M9 2.5L15.5 9L9 15.5L2.5 9L9 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case "circle":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="2.5" y="3.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2.5 7H15.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6 2V4.5M12 2V4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function BottomNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="bottom-nav" aria-label="Section navigation">
      {ITEMS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`bottom-nav-item ${active === item.id ? "is-active" : ""}`}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </a>
      ))}
      <style jsx>{`
        .bottom-nav {
          position: sticky;
          bottom: 0;
          z-index: 30;
          display: flex;
          justify-content: space-around;
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 10px 8px calc(10px + env(safe-area-inset-bottom, 0px));
        }
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-faint);
          text-decoration: none;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .bottom-nav-item:hover {
          color: var(--text-dim);
        }
        .bottom-nav-item.is-active {
          color: var(--accent);
        }
      `}</style>
    </nav>
  );
}
