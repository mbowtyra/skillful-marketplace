"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchBooks, createBook } from "@/lib/api";
import type { Book } from "@/lib/mock-data";
import Bookshelf from "@/components/Bookshelf";
import CompactHero from "@/components/CompactHero";
import { IncomingRequestsSection, LentOutSection } from "@/components/CheckoutSection";
import type { CheckoutWithBook } from "@/components/CheckoutSection";

const SPINE_COLORS = [
  "#2D5016", "#6B1D2A", "#D4A843", "#1B3A4B", "#C4722A",
  "#4A2C5E", "#1A5C3A", "#8B6914", "#3D1C02", "#2B2B2B",
  "#C44536", "#A67B2E",
];

export default function MyShelfPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    author: "",
    condition: "Good",
    description: "",
    exchangeType: "both" as "local" | "shipping" | "both",
    spineColor: SPINE_COLORS[0],
    coverImageUrl: "",
  });

  const [coverResults, setCoverResults] = useState<{ url: string; label: string; workKey?: string }[]>([]);
  const [coverSearching, setCoverSearching] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [descFetching, setDescFetching] = useState(false);

  const searchCovers = async () => {
    if (!form.title) return;
    setCoverSearching(true);
    setCoverResults([]);
    setCoverError("");
    try {
      const q = encodeURIComponent(`${form.title} ${form.author}`.trim());
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${q}&limit=20&fields=cover_i,title,author_name,key`,
      );
      if (!res.ok) throw new Error("Open Library unavailable");
      const data = await res.json();

      // Only use cover_i (Open Library's internal ID) — ISBN covers are often missing
      const results: { url: string; label: string; workKey?: string }[] = [];
      const seenIds = new Set<number>();
      for (const doc of data.docs ?? []) {
        if (doc.cover_i && !seenIds.has(doc.cover_i)) {
          seenIds.add(doc.cover_i);
          results.push({
            url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
            label: doc.title ?? form.title,
            workKey: doc.key ?? undefined,
          });
        }
        if (results.length >= 8) break;
      }

      if (results.length === 0) {
        setCoverError("No covers found — try a different title or add the book without a cover.");
      } else {
        setCoverResults(results);
      }
    } catch {
      setCoverError("Couldn't reach Open Library. Check your connection and try again.");
    } finally {
      setCoverSearching(false);
    }
  };

  const pickCover = async (result: { url: string; label: string; workKey?: string }) => {
    setForm((f) => ({ ...f, coverImageUrl: result.url }));
    setCoverResults([]);

    // Auto-fetch description from the work if description is still empty
    if (!form.description && result.workKey) {
      setDescFetching(true);
      try {
        const res = await fetch(`https://openlibrary.org${result.workKey}.json`);
        if (res.ok) {
          const work = await res.json();
          const raw = work.description;
          const desc: string = typeof raw === "string" ? raw : (raw?.value ?? "");
          // Strip markdown-style links and trim
          const cleaned = desc.replace(/\[.*?\]\(.*?\)/g, "").replace(/\n+/g, " ").trim();
          if (cleaned) setForm((f) => ({ ...f, description: cleaned.slice(0, 500) }));
        }
      } catch {
        // silently skip — description stays empty
      } finally {
        setDescFetching(false);
      }
    }
  };

  // Redirect to login only after auth has finished loading
  useEffect(() => {
    if (!authLoading && !token && !user) {
      router.replace("/login");
    }
  }, [authLoading, token, user, router]);

  // Fetch this user's books from the API
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetchBooks()
      .then((all) => {
        const mine = all.filter((b) => b.owner.id === user.id);
        setBooks(mine);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load books");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleAdd = async () => {
    if (!form.title || !form.author) return;
    setSubmitting(true);
    setFormError("");
    try {
      const newBook = await createBook({
        title: form.title,
        author: form.author,
        condition: form.condition,
        description: form.description || undefined,
        exchange_type: form.exchangeType,
        spine_color: form.spineColor,
        cover_image_url: form.coverImageUrl || undefined,
      });
      setBooks((prev) => [newBook, ...prev]);
      setForm({
        title: "", author: "", condition: "Good", description: "",
        exchangeType: "both",
        spineColor: SPINE_COLORS[Math.floor(Math.random() * SPINE_COLORS.length)],
        coverImageUrl: "",
      });
      setCoverResults([]);
      setCoverError("");
      setShowForm(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to add book");
    } finally {
      setSubmitting(false);
    }
  };

  const incomingRequests: CheckoutWithBook[] = books.flatMap((book) =>
    book.checkouts
      .filter((c) => c.status === "requested")
      .map((c) => ({ ...c, book }))
  );

  const lentOut: CheckoutWithBook[] = books.flatMap((book) =>
    book.checkouts.map((c) => ({ ...c, book }))
  );

  const inputClass = "w-full px-3.5 py-2.5 rounded-lg text-[13px] outline-none transition-colors placeholder:text-gray-400";

  return (
    <div>
      <CompactHero />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1
              className="text-3xl sm:text-4xl mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
            >
              My Shelf
            </h1>
            <p className="text-[15px]" style={{ color: "var(--gray-500)" }}>
              {loading
                ? "Loading your books…"
                : books.length > 0
                  ? `${books.length} book${books.length !== 1 ? "s" : ""} you're sharing with friends.`
                  : "Add books to start sharing with friends."}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: showForm ? "var(--gray-600)" : "var(--manuscript-red)" }}
          >
            {showForm ? "Cancel" : "+ Add Book"}
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-[13px]" style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FCA5A5" }}>
            {error}
          </div>
        )}

        {showForm && (
          <div className="rounded-xl p-6 mb-10 detail-panel shadow-sm" style={{ border: "1px solid var(--gray-200)", background: "var(--parchment)" }}>
            <h2 className="text-lg text-gray-900 mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Add a Book
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); setCoverResults([]); setCoverError(""); }} placeholder="The Great Gatsby" className={inputClass} style={{ border: "1px solid var(--gray-200)", background: "var(--off-white)" }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-1.5">Author *</label>
                <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="F. Scott Fitzgerald" className={inputClass} style={{ border: "1px solid var(--gray-200)", background: "var(--off-white)" }} />
              </div>
            </div>

            {/* Cover Image Search */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500">Book Cover</label>
                <button
                  type="button"
                  onClick={searchCovers}
                  disabled={!form.title || coverSearching}
                  className="text-[11px] font-semibold px-3 py-1 rounded-lg transition-all disabled:opacity-40"
                  style={{ background: "var(--gray-100)", color: "var(--manuscript-red)" }}
                >
                  {coverSearching ? "Searching…" : "Search Open Library"}
                </button>
              </div>

              {form.coverImageUrl && (
                <div className="flex items-center gap-3 mb-2 p-2 rounded-lg" style={{ background: "var(--gray-100)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImageUrl} alt="Selected cover" className="w-10 h-14 object-cover rounded shadow-sm" />
                  <span className="text-[12px] text-gray-600 flex-1">Cover selected</span>
                  <button type="button" onClick={() => setForm({ ...form, coverImageUrl: "" })} className="text-[11px] text-gray-400 hover:text-gray-600">✕ Remove</button>
                </div>
              )}

              {coverResults.length > 0 && (
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {coverResults.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickCover(r)}
                      className="rounded overflow-hidden transition-all hover:scale-105 hover:shadow-md"
                      style={{ outline: form.coverImageUrl === r.url ? "2px solid var(--burgundy)" : "none", outlineOffset: "2px" }}
                      title={r.label}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.url} alt={r.label} className="w-full aspect-[2/3] object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {coverError && (
                <p className="text-[11px] mt-1" style={{ color: "#B91C1C" }}>{coverError}</p>
              )}

              {!form.coverImageUrl && coverResults.length === 0 && !coverError && (
                <p className="text-[11px] text-gray-400">
                  Enter a title above, then click &ldquo;Search Open Library&rdquo; to find the real cover.
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-1.5">Condition</label>
                <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className={`${inputClass} cursor-pointer`} style={{ border: "1px solid var(--gray-200)", background: "var(--off-white)" }}>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-1.5">Exchange Type</label>
                <select value={form.exchangeType} onChange={(e) => setForm({ ...form, exchangeType: e.target.value as "local" | "shipping" | "both" })} className={`${inputClass} cursor-pointer`} style={{ border: "1px solid var(--gray-200)", background: "var(--off-white)" }}>
                  <option value="both">Meet Up or Mail It</option>
                  <option value="local">Meet Up Only</option>
                  <option value="shipping">Mail It Only</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-2">Spine Color</label>
              <div className="flex gap-2 flex-wrap">
                {SPINE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setForm({ ...form, spineColor: color })}
                    className="w-7 h-7 rounded-md transition-all"
                    style={{
                      background: color,
                      outline: form.spineColor === color ? "2.5px solid var(--burgundy)" : "none",
                      outlineOffset: "2px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 block mb-1.5">
                Description <span className="normal-case font-normal tracking-normal text-gray-400">(optional — auto-filled from Open Library)</span>
              </label>
              <div className="relative">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What would you tell a friend about this book?" className={`${inputClass} resize-none`} style={{ border: "1px solid var(--gray-200)", background: "var(--off-white)" }} />
                {descFetching && (
                  <span className="absolute right-3 top-3 text-[11px] text-gray-400 animate-pulse">Fetching summary…</span>
                )}
              </div>
            </div>

            {formError && (
              <p className="text-[13px] mb-4 px-3 py-2.5 rounded-lg" style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FCA5A5" }}>
                {formError}
              </p>
            )}

            <button
              onClick={handleAdd}
              disabled={!form.title || !form.author || submitting}
              className="w-full py-3 rounded-lg text-[13px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--forest)" }}
            >
              {submitting ? "Adding…" : "Add to Shelf"}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 text-[14px]">
            Loading your shelf…
          </div>
        ) : (
          <Bookshelf
          books={books}
          showOwnerFilter={false}
          isOwner
          onDelete={(id) => setBooks((prev) => prev.filter((b) => b.id !== id))}
        />
        )}

        <IncomingRequestsSection requests={incomingRequests} title="Friends Who Want Your Books" />
        <LentOutSection checkouts={lentOut} />
      </div>
    </div>
  );
}
