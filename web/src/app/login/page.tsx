"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, register, user, isLoading } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in — send to home
  useEffect(() => {
    if (!isLoading && user) router.replace("/");
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, displayName, password);
      }
      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = [
    "w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all duration-200",
    "placeholder:text-gray-400",
  ].join(" ");

  const inputStyle = {
    border: "1px solid var(--gray-200)",
    background: "var(--off-white)",
    color: "var(--gray-900)",
  };

  return (
    <div
      className="relative flex items-start justify-center px-4 pt-12 pb-24"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {/* Marbled background — absolute so it only covers this section, not the full viewport */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(/illustrations/marbled-endpaper.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-10">
          <img src="/illustrations/logo-b.png" alt="" style={{ width: 44, height: 44 }} aria-hidden="true" />
          <span
            className="text-[26px] tracking-[0.02em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
          >
            ookBuds
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl shadow-xl px-8 py-9"
          style={{
            background: "var(--parchment)",
            border: "1px solid var(--gray-200)",
          }}
        >
          {/* Tab switcher */}
          <div
            className="flex rounded-xl mb-8 p-1"
            style={{ background: "var(--gray-100)" }}
          >
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200"
                style={{
                  background: mode === m ? "white" : "transparent",
                  color: mode === m ? "var(--gray-900)" : "var(--gray-400)",
                  boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  fontFamily: "var(--font-display)",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-[1.5px] mb-1.5"
                  style={{ color: "var(--gray-500)" }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Melissa"
                  required
                  autoComplete="name"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-[1.5px] mb-1.5"
                style={{ color: "var(--gray-500)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-[1.5px] mb-1.5"
                style={{ color: "var(--gray-500)" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "At least 8 characters" : "••••••••"}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {error && (
              <p
                className="text-[13px] px-3 py-2.5 rounded-lg"
                style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FCA5A5" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 mt-1 rounded-xl text-[14px] font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "var(--manuscript-red)", fontFamily: "var(--font-display)" }}
            >
              {submitting
                ? (mode === "login" ? "Signing in…" : "Creating account…")
                : (mode === "login" ? "Sign In" : "Create Account")}
            </button>
          </form>

          <p className="text-center text-[12px] mt-6" style={{ color: "var(--gray-400)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="underline cursor-pointer transition-colors"
              style={{ color: "var(--manuscript-red)" }}
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
