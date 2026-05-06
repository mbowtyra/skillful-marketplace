"use client";

import { useState } from "react";
import Image from "next/image";
import type { Book } from "@/lib/mock-data";

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function getPattern(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 4;
}

export default function BookCover({
  book,
  onClick,
  size = "md",
  dimmed = false,
}: {
  book: Book;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  dimmed?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = !!book.coverImageUrl && !imgError;

  const light = lighten(book.spineColor, 60);
  const pattern = getPattern(book.id);

  const sizeClasses = { sm: "w-24", md: "w-36", lg: "w-48" };
  const titleSize = { sm: "text-xs", md: "text-sm", lg: "text-lg" };
  const authorSize = { sm: "text-[9px]", md: "text-[10px]", lg: "text-xs" };

  const patterns: Record<number, string> = {
    0: `radial-gradient(circle at 30% 70%, ${light}33 0%, transparent 50%)`,
    1: `linear-gradient(160deg, ${light}22 0%, transparent 40%, ${light}15 100%)`,
    2: `radial-gradient(ellipse at 70% 20%, ${light}28 0%, transparent 55%)`,
    3: `linear-gradient(45deg, transparent 40%, ${light}18 40%, ${light}18 60%, transparent 60%)`,
  };

  return (
    <button
      onClick={onClick}
      className={`book-cover ${sizeClasses[size]} cursor-pointer group`}
      style={dimmed ? { filter: "grayscale(0.7) brightness(0.7)", opacity: 0.6 } : undefined}
      aria-label={`${book.title} by ${book.author}`}
    >
      {hasImage ? (
        <Image
          src={book.coverImageUrl!}
          alt={`Cover of ${book.title}`}
          fill
          sizes={size === "lg" ? "192px" : size === "md" ? "144px" : "96px"}
          className="object-cover z-[1]"
          onError={() => setImgError(true)}
          unoptimized
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col justify-between p-4 z-[1]"
          style={{
            background: `linear-gradient(170deg, ${book.spineColor} 0%, ${lighten(book.spineColor, -20)} 100%)`,
          }}
        >
          <div className="absolute inset-0" style={{ background: patterns[pattern] }} />
          <div className="relative z-[1] flex flex-col h-full justify-between">
            <div className="w-10 h-px mb-3 opacity-30" style={{ background: light }} />
            <div className="flex-1 flex flex-col justify-center">
              <h3
                className={`${titleSize[size]} font-bold leading-tight mb-2 text-white`}
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                {book.title}
              </h3>
              <p
                className={`${authorSize[size]} font-medium tracking-wide uppercase`}
                style={{ color: `${light}cc` }}
              >
                {book.author}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-6 h-px opacity-30" style={{ background: light }} />
              <div className="w-1.5 h-1.5 rounded-full opacity-25" style={{ background: light }} />
              <div className="w-6 h-px opacity-30" style={{ background: light }} />
            </div>
          </div>
        </div>
      )}

      {dimmed && (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[3] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white/90 bg-black/50 backdrop-blur-sm whitespace-nowrap">
          Checked Out
        </span>
      )}
    </button>
  );
}
