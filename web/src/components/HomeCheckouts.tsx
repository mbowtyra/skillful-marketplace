"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyCheckoutsRich, fetchIncomingCheckoutsRich, type RichCheckout } from "@/lib/api";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  requested: { bg: "#FFF8E1", text: "#F57F17", label: "Pending" },
  approved:  { bg: "#E8F5E9", text: "#2E7D32", label: "Checked Out" },
};

function AvatarThumb({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  return (
    <div
      className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
      style={{ background: avatarUrl ? "transparent" : "var(--gray-300)" }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        name[0]?.toUpperCase()
      )}
    </div>
  );
}

function CoverThumb({ book }: { book: RichCheckout["book"] }) {
  return (
    <div
      className="w-11 h-[66px] rounded-sm flex-shrink-0 overflow-hidden relative"
      style={!book.cover_image_url ? {
        background: `linear-gradient(135deg, ${book.spine_color}, ${book.spine_color}dd)`,
        boxShadow: "2px 2px 6px rgba(0,0,0,0.12)",
      } : {
        boxShadow: "2px 2px 6px rgba(0,0,0,0.12)",
      }}
    >
      {book.cover_image_url && (
        <Image src={book.cover_image_url} alt="" fill sizes="44px" className="object-cover" unoptimized />
      )}
    </div>
  );
}

export default function HomeCheckouts() {
  const { user } = useAuth();
  const [myBorrows, setMyBorrows] = useState<RichCheckout[]>([]);
  const [incoming, setIncoming] = useState<RichCheckout[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchMyCheckoutsRich().then(setMyBorrows).catch(() => {});
    fetchIncomingCheckoutsRich().then(setIncoming).catch(() => {});
  }, [user]);

  const incomingRequests = incoming.filter((c) => c.status === "requested");
  const lentOut = incoming.filter((c) => c.status === "approved");

  const allActivity = [...incomingRequests, ...myBorrows, ...lentOut];
  if (!user || allActivity.length === 0) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl sm:text-2xl text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Checkouts
          </h2>
          <p className="text-[13px] text-gray-500 mt-1">
            Books moving between friends right now
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {incomingRequests.map((c) => (
          <Link
            key={c.id}
            href="/my-books"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all no-underline"
          >
            <CoverThumb book={c.book} />
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-semibold text-gray-900 truncate">{c.book.title}</h3>
              <p className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                <AvatarThumb name={c.borrower.display_name} avatarUrl={c.borrower.avatar_url} />
                <strong className="text-gray-700">{c.borrower.display_name}</strong> wants to borrow this
              </p>
            </div>
            <span
              className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
              style={{ background: "#FFF8E1", color: "#F57F17" }}
            >
              New Request
            </span>
          </Link>
        ))}

        {myBorrows.map((c) => {
          const s = STATUS_STYLES[c.status] ?? STATUS_STYLES.requested;
          return (
            <Link
              key={c.id}
              href="/shelf"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all no-underline"
            >
              <CoverThumb book={c.book} />
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-gray-900 truncate">{c.book.title}</h3>
                <p className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <AvatarThumb name={c.book_owner_name} avatarUrl={c.book_owner_avatar} />
                  from {c.book_owner_name}
                </p>
              </div>
              <span
                className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                style={{ background: s.bg, color: s.text }}
              >
                {s.label}
              </span>
            </Link>
          );
        })}

        {lentOut.map((c) => (
          <Link
            key={c.id}
            href="/my-books"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all no-underline"
          >
            <CoverThumb book={c.book} />
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-semibold text-gray-900 truncate">{c.book.title}</h3>
              <p className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                <AvatarThumb name={c.borrower.display_name} avatarUrl={c.borrower.avatar_url} />
                Lent to <strong className="text-gray-700">{c.borrower.display_name}</strong>
              </p>
            </div>
            <span
              className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
              style={{ background: "#E8F5E9", color: "#2E7D32" }}
            >
              Lent Out
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
