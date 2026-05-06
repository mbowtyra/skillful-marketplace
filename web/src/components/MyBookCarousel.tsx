"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { fetchBooks, fetchIncomingCheckouts, type MyCheckout } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Book3D from "./Book3D";
import MyBookDetail from "./MyBookDetail";
import type { Book } from "@/lib/mock-data";

export default function MyBookCarousel() {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [incoming, setIncoming] = useState<MyCheckout[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchBooks()
      .then((all) => setBooks(all.filter((b) => b.owner.id === user.id)))
      .catch(() => {});
    fetchIncomingCheckouts().then(setIncoming).catch(() => {});
  }, [user]);

  // Map book_id → most urgent status on that book
  const incomingMap = new Map<string, "requested" | "approved">();
  for (const c of incoming) {
    // "approved" takes priority over "requested"
    if (!incomingMap.has(c.book_id) || c.status === "approved") {
      incomingMap.set(c.book_id, c.status);
    }
  }

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll, books]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: "smooth" });
  };

  if (books.length === 0) return (
    <p className="text-[13px] py-8 text-center" style={{ color: "var(--gray-400)" }}>
      You haven&apos;t added any books yet.
    </p>
  );

  return (
    <>
      <div className="relative group/carousel">
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none" />
        )}

        {canScrollLeft && (
          <button onClick={() => scroll("left")} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all opacity-0 group-hover/carousel:opacity-100" aria-label="Scroll left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        )}
        {canScrollRight && (
          <button onClick={() => scroll("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all opacity-0 group-hover/carousel:opacity-100" aria-label="Scroll right">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}

        <div ref={scrollRef} className="flex gap-7 overflow-x-auto scroll-smooth px-1 py-2 no-scrollbar">
          {books.map((book) => {
            const requestStatus = incomingMap.get(book.id);
            return (
              <div key={book.id} className="flex-shrink-0">
                <Book3D
                  book={book}
                  onClick={() => setSelectedBook(book)}
                  size="md"
                  dimmed={!book.available && !requestStatus}
                  checkoutStatus={requestStatus}
                />
                <div className="mt-3 px-0.5" style={{ width: 140 }}>
                  <h3 className="text-[12px] leading-tight line-clamp-2" style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}>
                    {book.title}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--gray-400)" }}>{book.author}</p>
                  {requestStatus === "approved" && (
                    <p className="text-[10px] mt-1 font-semibold" style={{ color: "var(--forest)" }}>Coordinate Pickup →</p>
                  )}
                  {requestStatus === "requested" && (
                    <p className="text-[10px] mt-1 font-semibold" style={{ color: "#B45309" }}>Someone requested this</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedBook && (
        <MyBookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onDelete={(id) => { setBooks((prev) => prev.filter((b) => b.id !== id)); setSelectedBook(null); }}
        />
      )}
    </>
  );
}
