"use client";

import { useState, useEffect, useCallback } from "react";
import type { Book } from "@/lib/mock-data";
import { requestCheckout } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type StampStep = "form" | "stamp-name" | "stamp-date" | "send" | "done";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "2-digit",
  });
}

export default function LibraryCard({
  book,
  showCheckout,
  setShowCheckout,
}: {
  book: Book;
  showCheckout: boolean;
  setShowCheckout: (v: boolean) => void;
}) {
  const { user } = useAuth();
  const [step, setStep] = useState<StampStep>("form");
  const [nameStamped, setNameStamped] = useState(false);
  const [dateStamped, setDateStamped] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [exchangeMethod, setExchangeMethod] = useState<"local" | "shipping">("local");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!showCheckout) {
      setStep("form");
      setNameStamped(false);
      setDateStamped(false);
      setSent(false);
      setNote("");
    }
  }, [showCheckout]);

  const handleStampName = useCallback(() => {
    setNameStamped(true);
    setTimeout(() => setStep("stamp-date"), 900);
  }, []);

  const handleStampDate = useCallback(() => {
    setDateStamped(true);
    setTimeout(() => setStep("send"), 700);
  }, []);

  const handleSend = useCallback(async () => {
    setSendError("");
    try {
      await requestCheckout(book.id, exchangeMethod, note || undefined);
      setSent(true);
      setStep("done");
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }, [book.id, exchangeMethod, note]);

  const hasHistory = book.checkouts.length > 0 || showCheckout;
  const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="library-card">
      <div className="library-card-header">
        <h3>Library Card</h3>
        <p>{book.title}</p>
      </div>

      <div className="card-columns">
        <span>Borrower&apos;s Name</span>
        <span>Date</span>
        <span>Date Due</span>
      </div>

      <div className="min-h-[64px]">
        {!hasHistory && (
          <div className="px-6 py-6 text-center">
            <p className="text-[12px] italic text-gray-400" style={{ fontFamily: "var(--font-sans)" }}>
              No one has borrowed this book yet. Be the first!
            </p>
          </div>
        )}

        {book.checkouts.map((checkout, i) => (
          <div key={checkout.id} className="card-row card-row-past">
            <span className="card-row-text">Reader {i + 1}</span>
            <span className="card-row-text text-[16px]">{formatDate(checkout.requestedAt)}</span>
            <span className="card-row-text text-[16px]">
              {checkout.returnedAt ? formatDate(checkout.returnedAt) : "\u2014"}
            </span>
          </div>
        ))}

        {/* Active checkout row — fills in as stamps happen */}
        {showCheckout && (
          <div
            className="card-row"
            style={{ background: "rgba(155, 41, 21, 0.03)", minHeight: 40 }}
          >
            {/* Name cell */}
            <span>
              {nameStamped ? (
                <span className="card-row-text stamp-name-in" style={{ color: "#2A1A0A" }}>
                  {user?.displayName ?? "You"}
                </span>
              ) : (
                <span className="card-row-text" style={{ color: "#D0C4B4", fontStyle: "italic", fontSize: 16 }}>
                  _______________
                </span>
              )}
            </span>

            {/* Date cell */}
            <span>
              {dateStamped ? (
                <span className="stamp-date-in">
                  <span className="stamp-date">{todayStr}</span>
                </span>
              ) : nameStamped ? (
                <span style={{ color: "#D0C4B4", fontSize: 13, fontFamily: "var(--font-sans)" }}>
                  ________
                </span>
              ) : (
                <span />
              )}
            </span>

            {/* Due date cell */}
            <span className="card-row-text text-[16px]" style={{ color: "#C0B0A0" }}>
              {nameStamped ? "\u2014" : ""}
            </span>
          </div>
        )}

        {/* Empty rows */}
        {Array.from({ length: Math.max(0, 3 - book.checkouts.length - (showCheckout ? 1 : 0)) }).map((_, i) => (
          <div key={`empty-${i}`} className="card-row">
            <span /><span /><span />
          </div>
        ))}
      </div>

      {/* ── Checkout Steps ─────────────────────────── */}

      {/* Step 1: Exchange method + note */}
      {showCheckout && step === "form" && (
        <div
          className="px-6 py-5 border-t"
          style={{ borderColor: "var(--card-line)", background: "rgba(245, 238, 220, 0.4)" }}
        >
          <div className="mb-4">
            <label className="text-[10px] font-semibold uppercase tracking-[1.5px] block mb-2"
              style={{ color: "#6A5A48", fontFamily: "var(--font-sans)" }}>
              Exchange Method
            </label>
            <div className="flex gap-2">
              {(["local", "shipping"] as const).map((method) => {
                const allowed = book.exchangeType === "both" || book.exchangeType === method;
                const active = exchangeMethod === method;
                return (
                  <button
                    key={method}
                    disabled={!allowed}
                    onClick={() => setExchangeMethod(method)}
                    className="flex-1 py-2 rounded-md text-[12px] font-medium border transition-all disabled:opacity-25"
                    style={{
                      fontFamily: "var(--font-sans)",
                      borderColor: active ? "var(--burgundy)" : "#D4C9A8",
                      background: active ? "rgba(124, 45, 62, 0.06)" : "transparent",
                      color: active ? "var(--burgundy)" : "#7A6B5A",
                    }}
                  >
                    {method === "local" ? "Meet Up" : "Mail It"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[10px] font-semibold uppercase tracking-[1.5px] block mb-2"
              style={{ color: "#6A5A48", fontFamily: "var(--font-sans)" }}>
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Hey, I've been wanting to read this!"
              className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none"
              style={{
                fontFamily: "var(--font-sans)",
                borderColor: "#D4C9A8",
                background: "var(--card-cream)",
                color: "#3A2A1A",
              }}
            />
          </div>

          <button
            onClick={() => setStep("stamp-name")}
            className="w-full py-2.5 rounded-md text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: "var(--burgundy)", fontFamily: "var(--font-sans)" }}
          >
            Next: Sign the Card
          </button>
        </div>
      )}

      {/* Step 2: Stamp your name */}
      {showCheckout && step === "stamp-name" && !nameStamped && (
        <div
          className="px-6 py-6 border-t text-center detail-panel"
          style={{ borderColor: "var(--card-line)", background: "rgba(245, 238, 220, 0.4)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[2px] mb-3"
            style={{ color: "#7A6B5A", fontFamily: "var(--font-sans)" }}>
            Step 1 of 2
          </p>
          <p className="text-[14px] mb-4"
            style={{ color: "#4E3E2E", fontFamily: "var(--font-display)" }}>
            Sign your name on the card
          </p>
          <button
            onClick={handleStampName}
            className="stamp-button group"
          >
            <span className="stamp-button-inner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-80">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              <span>Stamp Name</span>
            </span>
          </button>
        </div>
      )}

      {/* Step 2 → waiting for animation to finish */}
      {showCheckout && step === "stamp-name" && nameStamped && (
        <div
          className="px-6 py-5 border-t text-center"
          style={{ borderColor: "var(--card-line)", background: "rgba(245, 238, 220, 0.4)" }}
        >
          <p className="text-[13px] font-medium"
            style={{ color: "#7A6B5A", fontFamily: "var(--font-sans)" }}>
            Signed!
          </p>
        </div>
      )}

      {/* Step 3: Stamp the date */}
      {showCheckout && step === "stamp-date" && !dateStamped && (
        <div
          className="px-6 py-6 border-t text-center detail-panel"
          style={{ borderColor: "var(--card-line)", background: "rgba(245, 238, 220, 0.4)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[2px] mb-3"
            style={{ color: "#7A6B5A", fontFamily: "var(--font-sans)" }}>
            Step 2 of 2
          </p>
          <p className="text-[14px] mb-4"
            style={{ color: "#4E3E2E", fontFamily: "var(--font-display)" }}>
            Stamp today&apos;s date
          </p>
          <button
            onClick={handleStampDate}
            className="stamp-button group"
          >
            <span className="stamp-button-inner stamp-button-red">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-80">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Stamp Date</span>
            </span>
          </button>
        </div>
      )}

      {/* Step 3 → waiting for animation */}
      {showCheckout && step === "stamp-date" && dateStamped && (
        <div
          className="px-6 py-5 border-t text-center"
          style={{ borderColor: "var(--card-line)", background: "rgba(245, 238, 220, 0.4)" }}
        >
          <p className="text-[13px] font-medium"
            style={{ color: "#7A6B5A", fontFamily: "var(--font-sans)" }}>
            Dated!
          </p>
        </div>
      )}

      {/* Step 4: Send the request */}
      {showCheckout && step === "send" && !sent && (
        <div
          className="px-6 py-6 border-t text-center detail-panel"
          style={{ borderColor: "var(--card-line)", background: "rgba(245, 238, 220, 0.4)" }}
        >
          <p className="text-[14px] mb-4"
            style={{ color: "#4E3E2E", fontFamily: "var(--font-display)" }}>
            Card signed &amp; dated. Send your request?
          </p>
          {sendError && (
            <p className="text-[12px] mb-3 text-red-600" style={{ fontFamily: "var(--font-sans)" }}>
              {sendError}
            </p>
          )}
          <button
            onClick={handleSend}
            className="w-full py-3 rounded-md text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: "var(--forest)", fontFamily: "var(--font-sans)" }}
          >
            Send Request
          </button>
        </div>
      )}

      {/* Done */}
      {showCheckout && step === "done" && (
        <div
          className="px-6 py-5 border-t text-center detail-panel"
          style={{ borderColor: "var(--card-line)", background: "rgba(46, 125, 50, 0.04)" }}
        >
          <p className="text-[20px] mb-1">&#10003;</p>
          <p className="text-[13px] font-semibold" style={{ color: "#2E7D32", fontFamily: "var(--font-sans)" }}>
            Request sent!
          </p>
        </div>
      )}
    </div>
  );
}
