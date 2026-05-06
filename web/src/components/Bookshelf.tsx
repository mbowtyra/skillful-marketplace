"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import type { Book } from "@/lib/mock-data";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchBooks } from "@/lib/api";
import Book3D from "./Book3D";
import BookDetail from "./BookDetail";
import MyBookDetail from "./MyBookDetail";

interface BookshelfProps {
  books: Book[];
  showOwnerFilter?: boolean;
  isOwner?: boolean;
  onDelete?: (bookId: string) => void;
}

export default function Bookshelf({ books, showOwnerFilter = true, isOwner = false, onDelete }: BookshelfProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [view, setView] = useState<"covers" | "list">("covers");

  // Debounce the raw search string — waits 400ms after the user stops typing
  // before updating debouncedSearch, which then triggers the API call below.
  // Open the Network tab in Chrome DevTools to watch requests fire.
  const debouncedSearch = useDebounce(search, 400);

  const [apiSearchResults, setApiSearchResults] = useState<Book[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // useEffect runs after every render where debouncedSearch changes.
  // This is the standard React pattern for side effects (like fetching data).
  // Set a breakpoint on the fetchBooks() line in DevTools Sources to watch state update.
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setApiSearchResults(null);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);

    fetchBooks(debouncedSearch)
      .then((results) => {
        if (!cancelled) {
          // Map API shape → the Book shape the rest of the UI expects
          const mapped = results.map((r) => ({
            id: String(r.id),
            title: r.title,
            author: r.author,
            condition: r.condition,
            description: r.description,
            available: r.available,
            exchangeType: r.exchange_type,
            coverImageUrl: r.cover_image_url,
            spineColor: "#6B1D2A",
            owner: { id: String(r.owner_id), displayName: "—", email: "" },
            checkouts: [],
          })) as Book[];
          setApiSearchResults(mapped);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Search failed";
          setSearchError(message);
          setApiSearchResults(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    // Cleanup: if debouncedSearch changes again before the fetch finishes,
    // ignore the stale result
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  // Prefer live API results when available; fall back to the mock books prop
  const sourceBooks = apiSearchResults ?? books;

  const owners = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const b of sourceBooks) {
      const existing = counts.get(b.owner.id);
      if (existing) {
        existing.count++;
      } else {
        counts.set(b.owner.id, { name: b.owner.displayName, count: 1 });
      }
    }
    return Array.from(counts, ([id, { name, count }]) => ({ id, name, count }));
  }, [sourceBooks]);

  const filtered = useMemo(() => {
    // When we have live API search results they're already filtered by query —
    // skip the client-side text filter to avoid double-filtering
    let result = sourceBooks;
    if (ownerFilter) {
      result = result.filter((b) => b.owner.id === ownerFilter);
    }
    if (search && !apiSearchResults) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }
    if (availabilityFilter === "available") {
      result = result.filter((b) => b.available);
    } else if (availabilityFilter === "checked-out") {
      result = result.filter((b) => !b.available);
    }
    result = [...result].sort((a, b) => Number(b.available) - Number(a.available));
    return result;
  }, [sourceBooks, apiSearchResults, search, availabilityFilter, ownerFilter]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <div className="flex-1 relative">
          {/* Search icon — hidden while a request is in flight */}
          {!isSearching && (
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--gray-400)" }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}

          {/* Spinner shown while the debounced API request is in flight.
              You can watch this in Chrome DevTools → Network tab. */}
          {isSearching && (
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin"
              style={{ color: "var(--burgundy)" }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}

          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-200"
            style={{
              border: searchError
                ? "1px solid #C62828"
                : "1px solid var(--gray-200)",
              background: "var(--off-white)",
              color: "var(--gray-900)",
            }}
          />

          {/* Only shown if the API is unreachable — falls back to mock data */}
          {searchError && (
            <p className="text-[11px] mt-1.5 px-1" style={{ color: "#C62828" }}>
              API unreachable — showing local results. ({searchError})
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showOwnerFilter && (
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer transition-all duration-200"
              style={{ border: "1px solid var(--gray-200)", background: "var(--off-white)", color: "var(--gray-700)" }}
            >
              <option value="">All Friends</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.count})
                </option>
              ))}
            </select>
          )}

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer transition-all duration-200"
            style={{ border: "1px solid var(--gray-200)", background: "var(--off-white)", color: "var(--gray-700)" }}
          >
            <option value="">All Books</option>
            <option value="available">Available</option>
            <option value="checked-out">Checked Out</option>
          </select>

          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--gray-200)" }}>
            <button
              onClick={() => setView("covers")}
              className="px-3 py-2 transition-all duration-200"
              style={{
                background: view === "covers" ? "var(--burgundy)" : "var(--off-white)",
                color: view === "covers" ? "white" : "var(--gray-400)",
              }}
              title="Cover view"
              aria-label="Cover view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className="px-3 py-2 transition-all duration-200"
              style={{
                background: view === "list" ? "var(--burgundy)" : "var(--off-white)",
                color: view === "list" ? "white" : "var(--gray-400)",
              }}
              title="List view"
              aria-label="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <p className="text-[12px] mb-6" style={{ color: "var(--gray-400)" }}>
        {filtered.length} book{filtered.length !== 1 ? "s" : ""}
        {ownerFilter || availabilityFilter || search ? " matching filters" : ""}
      </p>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p className="text-base text-gray-700" style={{ fontFamily: "var(--font-display)" }}>
            No books found
          </p>
          <p className="text-sm mt-1 text-gray-400">
            {search || availabilityFilter || ownerFilter
              ? "Try adjusting your search or filters."
              : "Be the first to add a book!"}
          </p>
        </div>
      ) : view === "covers" ? (
        /* Cover Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filtered.map((book) => (
            <div key={book.id} className="group relative">
              <Book3D
                book={book}
                onClick={() => setSelectedBook(book)}
                size="md"
                dimmed={!book.available}
              />
              <div className="mt-3">
                <h3
                  className="text-[13px] leading-tight line-clamp-2 transition-colors"
                  style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}
                >
                  {book.title}
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--gray-500)" }}>{book.author}</p>
                {showOwnerFilter && (
                  <p className="text-[10px] mt-1" style={{ color: "var(--gray-400)" }}>
                    {book.owner.displayName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="flex flex-col gap-2">
          {filtered.map((book) => {
            const hasImage = !!book.coverImageUrl;
            return (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer hover:shadow-sm"
                style={{
                  border: "1px solid var(--gray-100)",
                  background: "var(--off-white)",
                  ...(book.available ? {} : { opacity: 0.55 }),
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gray-200)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--gray-100)"; }}
              >
                {/* Cover thumbnail */}
                <div className="w-11 h-[66px] rounded-sm flex-shrink-0 overflow-hidden relative"
                  style={!hasImage ? {
                    background: `linear-gradient(135deg, ${book.spineColor}, ${book.spineColor}dd)`,
                    boxShadow: "2px 2px 6px rgba(0,0,0,0.12)",
                  } : {
                    boxShadow: "2px 2px 6px rgba(0,0,0,0.12)",
                  }}
                >
                  {hasImage && (
                    <Image
                      src={book.coverImageUrl!}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-gray-900 truncate">
                    {book.title}
                  </h3>
                  <p className="text-[12px] text-gray-500">{book.author}</p>
                  {book.description && (
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{book.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{
                      background: book.available ? "#E8F5E9" : "#FFEBEE",
                      color: book.available ? "#2E7D32" : "#C62828",
                    }}
                  >
                    {book.available ? "Available" : "Checked Out"}
                  </span>
                </div>

                {showOwnerFilter && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background: book.owner.avatarUrl ? "transparent" : "var(--gray-400)" }}
                    >
                      {book.owner.avatarUrl
                        ? <img src={book.owner.avatarUrl} alt="" className="w-full h-full object-cover" />
                        : book.owner.displayName[0]}
                    </div>
                    <span className="text-[11px] text-gray-400 hidden sm:inline">
                      {book.owner.displayName}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {selectedBook && (
        isOwner ? (
          <MyBookDetail
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onDelete={onDelete}
          />
        ) : (
          <BookDetail
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )
      )}
    </div>
  );
}
