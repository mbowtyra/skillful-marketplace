"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchBooks } from "@/lib/api";
import type { Book } from "@/lib/mock-data";
import Bookshelf from "@/components/Bookshelf";
import CompactHero from "@/components/CompactHero";
import { BorrowsSection } from "@/components/CheckoutSection";
import type { CheckoutWithBook } from "@/components/CheckoutSection";

export default function ShelfPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [friendBooks, setFriendBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect to login only after auth has finished loading
  useEffect(() => {
    if (!authLoading && !token && !user) {
      router.replace("/login");
    }
  }, [authLoading, token, user, router]);

  // Fetch all available books, then filter out the current user's own books
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetchBooks()
      .then((all) => {
        setFriendBooks(all.filter((b) => b.owner.id !== user.id));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load books");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const friendCount = new Set(friendBooks.map((b) => b.owner.displayName)).size;

  const activeBorrows: CheckoutWithBook[] = friendBooks.flatMap((book) =>
    book.checkouts
      .filter((c) => c.borrower.id === user?.id && (c.status === "approved" || c.status === "requested"))
      .map((c) => ({ ...c, book }))
  );

  return (
    <div>
      <CompactHero />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="mb-10">
          <h1
            className="text-3xl sm:text-4xl mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
          >
            Friends&apos; Shelves
          </h1>
          <p className="text-[15px]" style={{ color: "var(--gray-500)" }}>
            {loading
              ? "Loading…"
              : error
                ? "Couldn't load books right now."
                : friendCount > 0
                  ? `See what your ${friendCount} friend${friendCount !== 1 ? "s" : ""} are sharing. Click any book to check it out.`
                  : "No books on friends' shelves yet."}
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-[13px]" style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FCA5A5" }}>
            {error}
          </div>
        )}

        {activeBorrows.length > 0 && (
          <BorrowsSection
            checkouts={activeBorrows}
            title="Your Active Checkouts"
            emptyMessage="You haven't borrowed any books yet."
            compact
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 text-[14px]">
            Loading friends&apos; shelves…
          </div>
        ) : (
          <div className={activeBorrows.length > 0 ? "mt-10" : ""}>
            <Bookshelf books={friendBooks} />
          </div>
        )}
      </div>
    </div>
  );
}
