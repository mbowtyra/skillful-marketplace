"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Book } from "@/lib/mock-data";
import Book3D from "./Book3D";
import LibraryCard from "./LibraryCard";

export default function BookDetail({
  book,
  onClose,
}: {
  book: Book;
  onClose: () => void;
}) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const conditionBadge: Record<string, { bg: string; text: string }> = {
    "Like New": { bg: "#E8F5E9", text: "#2E7D32" },
    Good: { bg: "#FFF8E1", text: "#F57F17" },
    Fair: { bg: "#FFF3E0", text: "#E65100" },
  };
  const badge = conditionBadge[book.condition] || conditionBadge["Good"];

  const exchangeLabel: Record<string, string> = {
    local: "Meet Up",
    shipping: "Mail It",
    both: "Meet Up or Mail It",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overlay-fade"
      style={{ background: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="detail-panel w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl overflow-hidden"
        style={{ background: "var(--page-bg)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--gray-100)" }}>
          <h2
            className="text-lg leading-tight truncate pr-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
          >
            {book.title}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-200"
            style={{ color: "var(--gray-400)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gray-600)"; e.currentTarget.style.background = "var(--gray-100)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gray-400)"; e.currentTarget.style.background = "transparent"; }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {/* Top: Cover + Info */}
          <div className="flex gap-6 mb-8">
            <div className="flex-shrink-0">
              <Book3D book={book} size="md" showInfo={false} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm mb-4" style={{ color: "var(--gray-500)" }}>
                by {book.author}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span
                  className="px-2.5 py-0.5 rounded text-[11px] font-semibold"
                  style={{ background: badge.bg, color: badge.text }}
                >
                  {book.condition}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-600">
                  {exchangeLabel[book.exchangeType]}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded text-[11px] font-semibold"
                  style={{
                    background: book.available ? "#E8F5E9" : "#FFEBEE",
                    color: book.available ? "#2E7D32" : "#C62828",
                  }}
                >
                  {book.available ? "Available" : "Checked Out"}
                </span>
              </div>

            </div>
          </div>

          {/* Description */}
          {book.description && (
            <p className="text-sm leading-relaxed text-gray-600 mb-8">
              {book.description}
            </p>
          )}

          {/* Library Card */}
          <LibraryCard book={book} showCheckout={showCheckout} setShowCheckout={setShowCheckout} />

          {/* Follow banner for unavailable books */}
          {!book.available && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 mt-6 mb-2">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: following ? "var(--burgundy)" : "#E5E7EB" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={following ? "white" : "none"} stroke={following ? "white" : "#9CA3AF"} strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900">
                    {following ? "You\u2019re following this book" : "This book is checked out"}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {following
                      ? "We\u2019ll notify you when it\u2019s available again."
                      : "Follow it to get notified when it\u2019s available again."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            {book.available && !showCheckout && (
              <button
                onClick={() => setShowCheckout(true)}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.98]"
                style={{ background: "var(--burgundy)" }}
              >
                Borrow This Book
              </button>
            )}
            {!book.available && (
              <button
                onClick={() => setFollowing(!following)}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                style={following
                  ? { background: "var(--burgundy)", color: "white" }
                  : { background: "transparent", color: "var(--burgundy)", border: "1.5px solid var(--burgundy)" }
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={following ? "white" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                {following ? "Following" : "Follow This Book"}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200"
              style={{ border: "1px solid var(--gray-200)", color: "var(--gray-600)" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
