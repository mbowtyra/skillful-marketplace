"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Book } from "@/lib/mock-data";
import { deleteBook } from "@/lib/api";
import Book3D from "./Book3D";

export default function MyBookDetail({
  book,
  onClose,
  onDelete,
}: {
  book: Book;
  onClose: () => void;
  onDelete?: (bookId: string) => void;
}) {
  const [available, setAvailable] = useState(book.available);
  const [condition, setCondition] = useState(book.condition);
  const [description, setDescription] = useState(book.description || "");
  const [exchangeType, setExchangeType] = useState(book.exchangeType);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      await deleteBook(book.id);
      onDelete?.(book.id);
      onClose();
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const conditionBadge: Record<string, { bg: string; text: string }> = {
    "Like New": { bg: "#E8F5E9", text: "#2E7D32" },
    Good: { bg: "#FFF8E1", text: "#F57F17" },
    Fair: { bg: "#FFF3E0", text: "#E65100" },
  };
  const badge = conditionBadge[condition] || conditionBadge["Good"];

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overlay-fade"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="detail-panel w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl overflow-hidden"
        style={{ background: "var(--page-bg)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header row — never scrolls away */}
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

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {/* Cover + Info */}
          <div className="flex gap-6 mb-6">
            <div className="flex-shrink-0">
              <Book3D book={book} size="md" dimmed={!available} showInfo={false} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm text-gray-500 mb-4">by {book.author}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold" style={{ background: badge.bg, color: badge.text }}>
                  {condition}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded text-[11px] font-semibold"
                  style={{ background: available ? "#E8F5E9" : "#FFEBEE", color: available ? "#2E7D32" : "#C62828" }}
                >
                  {available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Availability</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {available ? "Friends can request to borrow this book" : "Hidden from friends\u2019 browse"}
                </p>
              </div>
              <button
                onClick={() => setAvailable(!available)}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                style={{ background: available ? "var(--burgundy)" : "#D1D5DB" }}
                aria-label="Toggle availability"
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                  style={{ transform: available ? "translateX(22px)" : "translateX(2px)" }}
                />
              </button>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-1.5">Condition</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className={`${inputClass} cursor-pointer`}>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-1.5">Exchange Type</label>
                <select value={exchangeType} onChange={(e) => setExchangeType(e.target.value as Book["exchangeType"])} className={`${inputClass} cursor-pointer`}>
                  <option value="both">Meet Up or Mail It</option>
                  <option value="local">Meet Up Only</option>
                  <option value="shipping">Mail It Only</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What would you tell a friend about this book?"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Checkout History */}
          {book.checkouts.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-3">Borrow History</p>
              <div className="space-y-2">
                {book.checkouts.map((checkout, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 text-[12px]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: "var(--gray-400)" }}>
                        {checkout.borrower.displayName[0]}
                      </div>
                      <span className="text-gray-700 font-medium">{checkout.borrower.displayName}</span>
                    </div>
                    <span className="text-gray-400">{checkout.requestedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-lg text-[13px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ background: saved ? "#2E7D32" : "var(--burgundy)" }}
            >
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg text-[13px] font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200"
            style={{
              color: confirmDelete ? "white" : "#B91C1C",
              background: confirmDelete ? "#B91C1C" : "transparent",
              border: `1px solid ${confirmDelete ? "#B91C1C" : "#FECACA"}`,
            }}
            onMouseEnter={(e) => { if (!confirmDelete) e.currentTarget.style.background = "#FEF2F2"; }}
            onMouseLeave={(e) => { if (!confirmDelete) e.currentTarget.style.background = "transparent"; }}
          >
            {deleting ? "Removing…" : confirmDelete ? "Tap again to confirm removal" : "Remove from Shelf"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
