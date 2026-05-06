"use client";

import Image from "next/image";
import type { Book, Checkout } from "@/lib/mock-data";

export interface CheckoutWithBook extends Checkout {
  book: Book;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  requested: { bg: "#FFF8E1", text: "#F57F17", label: "Pending" },
  approved: { bg: "#E8F5E9", text: "#2E7D32", label: "Checked Out" },
  returned: { bg: "#F5F5F5", text: "#757575", label: "Returned" },
  declined: { bg: "#FFEBEE", text: "#C62828", label: "Declined" },
};

function CoverThumbnail({ book }: { book: Book }) {
  return (
    <div
      className="w-11 h-[66px] rounded-sm flex-shrink-0 overflow-hidden relative"
      style={!book.coverImageUrl ? {
        background: `linear-gradient(135deg, ${book.spineColor}, ${book.spineColor}dd)`,
        boxShadow: "2px 2px 6px rgba(0,0,0,0.12)",
      } : {
        boxShadow: "2px 2px 6px rgba(0,0,0,0.12)",
      }}
    >
      {book.coverImageUrl && (
        <Image
          src={book.coverImageUrl}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
          unoptimized
        />
      )}
    </div>
  );
}

function CheckoutCard({ checkout }: { checkout: CheckoutWithBook }) {
  const s = STATUS_STYLES[checkout.status];
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all">
      <CoverThumbnail book={checkout.book} />
      <div className="flex-1 min-w-0">
        <h3 className="text-[13px] font-semibold text-gray-900 truncate">
          {checkout.book.title}
        </h3>
        <p className="text-[12px] text-gray-500">
          {checkout.book.author}
        </p>
        <p className="text-[11px] mt-0.5 text-gray-400">
          {checkout.exchangeMethod === "local" ? "Meet Up" : "Mail It"}
          {" · "}
          {new Date(checkout.requestedAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric",
          })}
        </p>
      </div>
      <span
        className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
        style={{ background: s.bg, color: s.text }}
      >
        {s.label}
      </span>
    </div>
  );
}

function IncomingRequestCard({
  checkout,
  onApprove,
  onDecline,
}: {
  checkout: CheckoutWithBook;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all">
      <CoverThumbnail book={checkout.book} />
      <div className="flex-1 min-w-0">
        <h3 className="text-[13px] font-semibold text-gray-900 truncate">
          {checkout.book.title}
        </h3>
        <p className="text-[12px] text-gray-500">
          Requested by <strong className="text-gray-700">{checkout.borrower.displayName}</strong>
        </p>
        <p className="text-[11px] mt-0.5 text-gray-400">
          {checkout.exchangeMethod === "local" ? "Meet Up" : "Mail It"}
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onApprove?.(checkout.id)}
          className="px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white transition-all hover:brightness-110"
          style={{ background: "var(--forest)" }}
        >
          Approve
        </button>
        <button
          onClick={() => onDecline?.(checkout.id)}
          className="px-3.5 py-2 rounded-lg text-[12px] font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function BorrowsSection({
  checkouts,
  title = "Your Checkouts",
  emptyMessage = "No checkouts yet.",
  compact = false,
  maxItems,
}: {
  checkouts: CheckoutWithBook[];
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
  maxItems?: number;
}) {
  const items = maxItems ? checkouts.slice(0, maxItems) : checkouts;

  return (
    <div className={compact ? "" : "mt-10"}>
      <h2 className="text-[11px] font-semibold tracking-[2px] uppercase text-gray-400 mb-4">
        {title}
      </h2>
      {items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((c) => (
            <CheckoutCard key={c.id} checkout={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export function IncomingRequestsSection({
  requests,
  title = "Incoming Requests",
  onApprove,
  onDecline,
}: {
  requests: CheckoutWithBook[];
  title?: string;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  if (requests.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--burgundy)] mb-4">
        {title}
      </h2>
      <div className="flex flex-col gap-2">
        {requests.map((c) => (
          <IncomingRequestCard
            key={c.id}
            checkout={c}
            onApprove={onApprove}
            onDecline={onDecline}
          />
        ))}
      </div>
    </div>
  );
}

export function LentOutSection({
  checkouts,
  title = "Currently Lent Out",
  emptyMessage = "None of your books are lent out right now.",
}: {
  checkouts: CheckoutWithBook[];
  title?: string;
  emptyMessage?: string;
}) {
  const active = checkouts.filter((c) => c.status === "approved");

  return (
    <div className="mt-10">
      <h2 className="text-[11px] font-semibold tracking-[2px] uppercase text-gray-400 mb-4">
        {title}
      </h2>
      {active.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="flex flex-col gap-2">
          {active.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all"
            >
              <CoverThumbnail book={c.book} />
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-gray-900 truncate">
                  {c.book.title}
                </h3>
                <p className="text-[12px] text-gray-500">
                  Borrowed by <strong className="text-gray-700">{c.borrower.displayName}</strong>
                </p>
                <p className="text-[11px] mt-0.5 text-gray-400">
                  {c.exchangeMethod === "local" ? "Meet Up" : "Mail It"}
                  {" · Since "}
                  {new Date(c.approvedAt!).toLocaleDateString("en-US", {
                    month: "short", day: "numeric",
                  })}
                </p>
              </div>
              <span
                className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                style={{ background: "#E8F5E9", color: "#2E7D32" }}
              >
                Lent Out
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
