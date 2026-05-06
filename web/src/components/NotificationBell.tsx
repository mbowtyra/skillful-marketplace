"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchNotifications, markNotificationRead } from "@/lib/api";
import type { Notification } from "@/lib/mock-data";

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch {
      // Silently fail — notifications are non-critical
    }
  }, [user]);

  // Poll for new notifications every 30 seconds while logged in
  useEffect(() => {
    if (!user) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30_000);
    return () => clearInterval(interval);
  }, [user, loadNotifications]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = async () => {
    const wasOpen = open;
    setOpen(!wasOpen);

    if (!wasOpen && unreadCount > 0) {
      setRinging(true);
      setTimeout(() => setRinging(false), 600);

      // Mark all unread notifications as read
      const unread = notifications.filter((n) => !n.read);
      await Promise.allSettled(unread.map((n) => markNotificationRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Notifications"
      >
        <svg
          className={ringing ? "bell-ring" : ""}
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] rounded-full bg-[var(--stamp-red)] text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[340px] rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
              Notifications
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-400">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                  style={{ background: n.read ? "transparent" : "rgba(124, 45, 62, 0.02)" }}
                >
                  <p className="text-[13px] leading-snug text-gray-700">
                    {!n.read && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--stamp-red)] mr-2 -translate-y-px" />
                    )}
                    {n.message}
                  </p>
                  <p className="text-[11px] mt-1 text-gray-400">
                    {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
