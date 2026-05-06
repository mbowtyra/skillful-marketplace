"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getMyFriendCode, addFriend, fetchFriends, removeFriend, type FriendInfo } from "@/lib/api";

export default function AddFriendModal({ onClose }: { onClose: () => void }) {
  const [myCode, setMyCode] = useState("");
  const [input, setInput] = useState("");
  const [friends, setFriends] = useState<FriendInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    Promise.all([getMyFriendCode(), fetchFriends()])
      .then(([code, list]) => { setMyCode(code); setFriends(list); })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setAdding(true);
    setError("");
    setSuccess("");
    try {
      const res = await addFriend(input);
      setSuccess(res.message);
      setFriends((prev) => [...prev, res.friend]);
      setInput("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    await removeFriend(id).catch(() => {});
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overlay-fade"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--page-bg)", maxHeight: "85vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--gray-100)" }}>
          <h2 className="text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
            Friends
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          {/* Your friend code */}
          <div className="mb-6 p-4 rounded-xl" style={{ background: "var(--parchment)", border: "1px solid var(--gray-200)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-2">Your Friend Code</p>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-widest flex-1" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
                {loading ? "Loading…" : myCode}
              </span>
              <button
                onClick={copyCode}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                style={{ background: copied ? "var(--forest)" : "var(--burgundy)", color: "white" }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Share this with friends so they can add you.</p>
          </div>

          {/* Add a friend */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-2">Add a Friend</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(""); setSuccess(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Enter friend code (e.g. FOXM-4A2B)"
                maxLength={9}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] outline-none"
                style={{ border: "1px solid var(--gray-200)", background: "var(--off-white)", letterSpacing: "0.05em" }}
              />
              <button
                onClick={handleAdd}
                disabled={!input.trim() || adding}
                className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: "var(--burgundy)" }}
              >
                {adding ? "Adding…" : "Add"}
              </button>
            </div>
            {error && <p className="text-[12px] mt-2" style={{ color: "#B91C1C" }}>{error}</p>}
            {success && <p className="text-[12px] mt-2" style={{ color: "#2E7D32" }}>✓ {success}</p>}
          </div>

          {/* Friend list */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-3">
              {friends.length === 0 ? "No friends yet" : `${friends.length} friend${friends.length !== 1 ? "s" : ""}`}
            </p>
            <div className="flex flex-col gap-2">
              {friends.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ border: "1px solid var(--gray-100)", background: "var(--off-white)" }}>
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-[12px] font-bold text-white"
                    style={{ background: f.avatar_url ? "transparent" : "var(--gray-300)" }}>
                    {f.avatar_url
                      ? <img src={f.avatar_url} alt={f.display_name} className="w-full h-full object-cover" />
                      : f.display_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900">{f.display_name}</p>
                    <p className="text-[11px] text-gray-400">{f.friend_code}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(f.id)}
                    className="text-[11px] text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
