"use client";

import Link from "next/link";
import FriendBookCarousel from "@/components/FriendBookCarousel";
import MyBookCarousel from "@/components/MyBookCarousel";
import HomeCheckouts from "@/components/HomeCheckouts";
import LampHero from "@/components/LampHero";
import CompactHero from "@/components/CompactHero";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {user ? <CompactHero /> : <LampHero />}

      <section>
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-6 sm:pt-16 sm:pb-8">
          {user ? (
            <>
              <div className="mb-10 float-in float-in-delay-1">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2
                      className="text-xl sm:text-2xl"
                      style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
                    >
                      On Friends&apos; Shelves
                    </h2>
                    <p className="text-[13px] mt-1.5" style={{ color: "var(--gray-400)" }}>
                      Books your friends are sharing right now
                    </p>
                  </div>
                  <Link
                    href="/shelf"
                    className="link-underline text-[12px] no-underline flex-shrink-0 transition-colors duration-200"
                    style={{ color: "var(--manuscript-red)", fontFamily: "var(--font-display)" }}
                  >
                    See all &rarr;
                  </Link>
                </div>
                <FriendBookCarousel />
              </div>

              <div className="mb-14 float-in float-in-delay-2">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2
                      className="text-xl sm:text-2xl"
                      style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
                    >
                      Your Shelf
                    </h2>
                    <p className="text-[13px] mt-1.5" style={{ color: "var(--gray-400)" }}>
                      Books you&apos;re sharing with friends
                    </p>
                  </div>
                  <Link
                    href="/my-books"
                    className="link-underline text-[12px] no-underline flex-shrink-0 transition-colors duration-200"
                    style={{ color: "var(--manuscript-red)", fontFamily: "var(--font-display)" }}
                  >
                    Manage &rarr;
                  </Link>
                </div>
                <MyBookCarousel />
              </div>

              <div className="float-in float-in-delay-3">
                <HomeCheckouts />
              </div>
            </>
          ) : (
            <div className="float-in float-in-delay-1">
              <div className="mb-8">
                <Link
                  href="/login"
                  className="inline-block px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg mb-5"
                  style={{ background: "var(--manuscript-red)", fontFamily: "var(--font-display)" }}
                >
                  Join BookBuds →
                </Link>
                <h2
                  className="text-xl sm:text-2xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
                >
                  On the Shelves of Buds in Your Area
                </h2>
                <p className="text-[13px] mt-1.5" style={{ color: "var(--gray-400)" }}>
                  See what people nearby are sharing
                </p>
              </div>
              <FriendBookCarousel />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
