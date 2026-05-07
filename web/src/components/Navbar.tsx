"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";
import AvatarPicker from "./AvatarPicker";
import AddFriendModal from "./AddFriendModal";
import { getAvatar, type Avatar } from "@/lib/avatars";
import { useAuth } from "@/contexts/AuthContext";

function LogoB() {
  return (
    <img
      src="/illustrations/logo-b.png"
      alt=""
      className="flex-shrink-0"
      style={{ width: 38, height: 38 }}
      aria-hidden="true"
    />
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [avatar, setAvatar] = useState<Avatar>(() => {
    const match = user?.avatarUrl ? AVATARS.find((a) => a.imagePath === user.avatarUrl) : null;
    return match ?? AVATARS[0];
  });
  const profileRef = useRef<HTMLDivElement>(null);

  // Sync avatar when user changes (e.g. after login)
  useEffect(() => {
    if (user?.avatarUrl) {
      const match = AVATARS.find((a) => a.imagePath === user.avatarUrl);
      if (match) setAvatar(match);
    }
  }, [user?.avatarUrl]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push("/");
  };

  const links = [
    { href: "/shelf", label: "Friends' Shelves" },
    { href: "/my-books", label: "My Shelf" },
  ];

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b relative"
        style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-[64px]">
          <Link href="/" className="flex items-center no-underline group" style={{ gap: "0.5px" }}>
            <LogoB />
            <span
              className="text-[20px] tracking-[0.02em] transition-opacity duration-200 group-hover:opacity-90"
              style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
            >
              ookBuds
            </span>
          </Link>

          {/* Nav links — only when logged in */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 text-[14px] tracking-[0.01em] no-underline transition-all duration-200 rounded-lg"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: active ? "var(--manuscript-red)" : "var(--gray-500)",
                      background: active ? "rgba(107,29,42,0.06)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--gray-900)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--gray-500)"; }}
                  >
                    {link.label}
                    {active && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background: "var(--manuscript-red)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <>
                <NotificationBell />

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md overflow-hidden"
                    style={{ border: "2px solid var(--gold)" }}
                    aria-label="Profile menu"
                  >
                    <img
                      src={avatar.imagePath}
                      alt={avatar.label}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border overflow-hidden"
                      style={{ background: "var(--parchment)", borderColor: "var(--gray-200)" }}
                    >
                      <div className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--gray-100)" }}>
                        <p className="text-[13px]" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
                          {user.displayName}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--gray-400)" }}>{user.email}</p>
                      </div>
                      <div className="py-1.5">
                        <button
                          onClick={() => { setProfileOpen(false); setShowAvatarPicker(true); }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-left transition-colors duration-150 cursor-pointer"
                          style={{ color: "var(--gray-600)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gray-50)"; e.currentTarget.style.color = "var(--gray-900)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gray-600)"; }}
                        >
                          <img src={avatar.imagePath} alt="" className="w-5 h-5 rounded-full flex-shrink-0 object-cover" />
                          Change Avatar
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); setShowAddFriend(true); }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] w-full text-left transition-colors duration-150"
                          style={{ color: "var(--gray-600)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gray-50)"; e.currentTarget.style.color = "var(--gray-900)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gray-600)"; }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                          </svg>
                          Friends
                        </button>
                        <Link
                          href="/my-books"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] no-underline transition-colors duration-150"
                          style={{ color: "var(--gray-600)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gray-50)"; e.currentTarget.style.color = "var(--gray-900)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gray-600)"; }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                          My Shelf
                        </Link>
                      </div>
                      <div style={{ borderTop: "1px solid var(--gray-100)" }} className="py-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-left transition-colors duration-150 cursor-pointer"
                          style={{ color: "var(--gray-600)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gray-50)"; e.currentTarget.style.color = "var(--stamp-red)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gray-600)"; }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile menu toggle */}
                <button
                  className="md:hidden p-2 rounded-lg transition-colors"
                  style={{ color: "var(--gray-500)" }}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                  </svg>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:brightness-110"
                style={{ background: "var(--manuscript-red)", fontFamily: "var(--font-display)" }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        {user && mobileOpen && (
          <div className="md:hidden border-t px-6 py-3 flex flex-col gap-1" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#ffffff" }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-[13px] no-underline rounded-lg transition-all duration-200"
                style={{
                  fontFamily: "var(--font-display)",
                  color: pathname === link.href ? "var(--manuscript-red)" : "var(--gray-500)",
                  background: pathname === link.href ? "rgba(107,29,42,0.06)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {showAddFriend && <AddFriendModal onClose={() => setShowAddFriend(false)} />}

      {showAvatarPicker && (
        <AvatarPicker
          currentAvatarId={avatar.id}
          onSelect={(newAvatar) => {
            setAvatar(newAvatar);
            updateUser({ avatarUrl: newAvatar.imagePath }).catch(console.error);
          }}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </>
  );
}
