"use client";

import { useState, useEffect, useCallback } from "react";

const WORDS = ["reading", "sharing", "meeting", "books"];
const WRITE_DURATION_MS = 2200;
const HOLD_DURATION_MS = 1800;
const FADE_DURATION_MS = 600;
const CYCLE_MS = WRITE_DURATION_MS + HOLD_DURATION_MS + FADE_DURATION_MS;

export default function CalligraphyHero() {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % WORDS.length);
    setAnimKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(advance, CYCLE_MS);
    return () => clearInterval(interval);
  }, [paused, advance]);

  return (
    <div className="text-center relative">
      <h1
        className="leading-[1.15] tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
      >
        <span className="block text-[clamp(2rem,4.5vw,3.5rem)]">
          A site for
        </span>
        <span
          key={animKey}
          className="calligraphy-word block text-[clamp(3.5rem,8vw,6.5rem)] my-2"
          style={{ color: "var(--manuscript-red)" }}
        >
          {WORDS[index]}
        </span>
        <span className="block text-[clamp(2rem,4.5vw,3.5rem)]">
          with buds
        </span>
      </h1>

      {/* Decorative flourish */}
      <div className="mt-8 flex items-center justify-center gap-3" style={{ color: "var(--gold)" }}>
        <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
          <path d="M0 6 C8 2, 16 10, 24 6 S32 2, 40 6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
        <span className="text-lg opacity-50">&#10087;</span>
        <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
          <path d="M0 6 C8 10, 16 2, 24 6 S32 10, 40 6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* Pause/play button for accessibility */}
      <button
        onClick={() => setPaused(!paused)}
        className="absolute top-0 right-0 p-1.5 rounded-md transition-colors duration-200 cursor-pointer"
        style={{
          color: "var(--gray-400)",
          background: "rgba(245,240,230,0.5)",
        }}
        aria-label={paused ? "Play animation" : "Pause animation"}
        title={paused ? "Play animation" : "Pause animation"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {paused ? (
            <polygon points="5 3 19 12 5 21 5 3" />
          ) : (
            <>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
