"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { fetchBooks, fetchMyCheckouts, fetchFriends, type MyCheckout, type FriendInfo } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Book3D from "./Book3D";
import BookDetail from "./BookDetail";
import type { Book } from "@/lib/mock-data";

export default function FriendBookCarousel() {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [myCheckouts, setMyCheckouts] = useState<MyCheckout[]>([]);

  useEffect(() => {
    const load = async () => {
      const [all, friendList] = await Promise.all([
        fetchBooks().catch(() => [] as Book[]),
        user ? fetchFriends().catch(() => [] as FriendInfo[]) : Promise.resolve([] as FriendInfo[]),
      ]);
      if (user) {
        const friendIds = new Set(friendList.map((f) => f.id));
        // Show friends' books; if no friends yet show everyone (better empty-state UX)
        const visible = friendIds.size > 0
          ? all.filter((b) => friendIds.has(b.owner.id))
          : all.filter((b) => b.owner.id !== user.id);
        setBooks(visible);
      } else {
        setBooks(all);
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchMyCheckouts().then(setMyCheckouts).catch(() => {});
  }, [user]);

  // Build a map of book_id → checkout status for fast lookup
  const checkoutMap = new Map(myCheckouts.map((c) => [c.book_id, c.status]));

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
      No books on friends&apos; shelves yet.
    </p>
  );

  return (
    <>
      <div className="relative group/carousel">
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50/80 to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50/80 to-transparent z-10 pointer-events-none" />
        )}

        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll right"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        <div ref={scrollRef} className="flex gap-7 overflow-x-auto scroll-smooth px-1 py-2 no-scrollbar">
          {books.map((book) => {
            const checkoutStatus = checkoutMap.get(book.id) as "requested" | "approved" | undefined;
            return (
            <div key={book.id} className="flex-shrink-0">
              <Book3D
                book={book}
                onClick={() => setSelectedBook(book)}
                size="md"
                dimmed={!book.available && !checkoutStatus}
                checkoutStatus={checkoutStatus}
              />
              <div className="mt-3 px-0.5" style={{ width: 140 }}>
                <h3
                  className="text-[12px] leading-tight line-clamp-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}
                >
                  {book.title}
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--gray-400)" }}>{book.author}</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--gray-400)" }}>{book.owner.displayName}</p>
                {checkoutStatus === "approved" && (
                  <p className="text-[10px] mt-1 font-semibold" style={{ color: "var(--forest)" }}>Coordinate Pickup →</p>
                )}
                {checkoutStatus === "requested" && (
                  <p className="text-[10px] mt-1 font-semibold" style={{ color: "#B45309" }}>Requested</p>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
}
