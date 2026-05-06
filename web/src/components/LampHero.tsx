"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LampHero({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[300px] sm:h-[340px] flex-col items-center justify-end overflow-hidden w-full",
        className
      )}
    >
      {/* Marbled endpaper background */}
      <img
        src="/illustrations/marbled-endpaper.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Subtle dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1410]/60 via-[#1A1410]/40 to-[#1A1410]/70" />

      {/* Warm glow from top center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[36rem] h-[14rem] rounded-full blur-3xl z-[1]"
        style={{ background: "radial-gradient(ellipse, rgba(196,152,46,0.45) 0%, rgba(212,170,68,0.15) 50%, transparent 80%)" }}
      />

      {/* Title text */}
      <div className="relative z-10 flex flex-col items-center px-5 pb-12 sm:pb-14">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="py-2 text-center text-4xl md:text-6xl"
          style={{ fontFamily: "'Nunito', system-ui, sans-serif", fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFCF5" }}
        >
          Settle in with
          <br />
          a bud&apos;s book.
        </motion.h1>
      </div>
    </div>
  );
}
