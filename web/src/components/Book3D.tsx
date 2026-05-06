"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Book } from "@/lib/mock-data";

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const SIZES = {
  sm: { width: 100, depth: 3 },
  md: { width: 148, depth: 4 },
  lg: { width: 196, depth: 5 },
} as const;

export default function Book3D({
  book,
  onClick,
  size = "md",
  dimmed = false,
  showInfo = true,
  checkoutStatus,
}: {
  book: Book;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  dimmed?: boolean;
  showInfo?: boolean;
  checkoutStatus?: "requested" | "approved";
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = !!book.coverImageUrl && !imgError;
  const { width, depth } = SIZES[size];
  const height = Math.round(width * (3 / 2));

  const visualStyle: React.CSSProperties =
    checkoutStatus === "requested"
      ? { filter: "grayscale(0.75) brightness(0.8)", opacity: 0.55 }
      : checkoutStatus === "approved"
      ? { filter: "brightness(1.05)" }
      : dimmed
      ? { filter: "grayscale(0.6) brightness(0.75)", opacity: 0.65 }
      : {};

  return (
    <button
      onClick={onClick}
      className={cn(
        "book-3d-wrapper cursor-pointer text-left group/book relative",
        checkoutStatus === "approved" && "ring-2 ring-offset-2 rounded-sm",
      )}
      style={
        {
          "--book-color": book.spineColor,
          "--book-depth": `${depth}cqw`,
          "--book-width": `${width}px`,
          ...(checkoutStatus === "approved" ? { "--tw-ring-color": "var(--forest)" } : {}),
          ...visualStyle,
        } as React.CSSProperties
      }
      aria-label={`${book.title} by ${book.author}`}
    >
      <div
        className="book-3d-inner"
        style={{ width, height, containerType: "inline-size" }}
      >
        {/* Front face */}
        <div
          className="book-3d-front absolute inset-0 overflow-hidden"
          style={{ background: book.spineColor }}
        >
          {/* Spine binding overlay */}
          <div className="book-3d-spine" />

          {hasImage ? (
            <Image
              src={book.coverImageUrl!}
              alt={`Cover of ${book.title}`}
              fill
              sizes={`${width}px`}
              className="object-cover"
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <FallbackCover book={book} size={size} />
          )}

          {/* Aged texture overlay */}
          <div className="book-3d-texture" />

          {/* Hover info overlay */}
          {showInfo && (
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/book:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p
                className={cn(
                  "text-white font-semibold leading-tight",
                  size === "sm" ? "text-[10px]" : "text-xs"
                )}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {book.title}
              </p>
              <p className="text-white/70 text-[9px] mt-0.5">{book.author}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={cn(
                    "text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm",
                    book.available
                      ? "bg-emerald-600/80 text-white"
                      : "bg-red-700/80 text-white"
                  )}
                >
                  {checkoutStatus === "requested"
                    ? "Requested"
                    : checkoutStatus === "approved"
                    ? "Coordinate Pickup"
                    : book.available ? "Available" : "Checked out"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right-side pages */}
        <div
          className="book-3d-pages"
          style={{
            width: `calc(${depth}cqw - 2px)`,
            height: `calc(100% - 6px)`,
            top: "3px",
            transform: `translateX(calc(${width}px - ${depth}cqw / 2 - 3px)) rotateY(90deg) translateX(calc(${depth}cqw / 2))`,
          }}
        />

        {/* Back cover */}
        <div
          className="book-3d-back"
          style={{
            background: `linear-gradient(170deg, ${book.spineColor} 0%, ${lighten(book.spineColor, -20)} 100%)`,
            transform: `translateZ(calc(-1 * ${depth}cqw))`,
          }}
        />
      </div>

      {(dimmed || checkoutStatus) && (
        <span
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider whitespace-nowrap backdrop-blur-sm"
          style={
            checkoutStatus === "approved"
              ? { background: "var(--forest)", color: "white" }
              : checkoutStatus === "requested"
              ? { background: "rgba(180,130,0,0.85)", color: "white" }
              : { background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.9)" }
          }
        >
          {checkoutStatus === "approved"
            ? "Coordinate Pickup"
            : checkoutStatus === "requested"
            ? "Requested"
            : "Checked Out"}
        </span>
      )}
    </button>
  );
}

function FallbackCover({ book, size }: { book: Book; size: "sm" | "md" | "lg" }) {
  const light = lighten(book.spineColor, 60);
  const titleSize = { sm: "text-[10px]", md: "text-sm", lg: "text-lg" };
  const authorSize = { sm: "text-[8px]", md: "text-[10px]", lg: "text-xs" };

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-3 z-[1]"
      style={{
        background: `linear-gradient(170deg, ${book.spineColor} 0%, ${lighten(book.spineColor, -20)} 100%)`,
      }}
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-8 h-px mb-2 opacity-30" style={{ background: light }} />
        <h3
          className={`${titleSize[size]} font-bold leading-tight mb-1.5 text-white`}
          style={{
            fontFamily: "'IM Fell English', Georgia, serif",
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
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
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-px opacity-30" style={{ background: light }} />
        <div className="w-1 h-1 rounded-full opacity-25" style={{ background: light }} />
        <div className="w-5 h-px opacity-30" style={{ background: light }} />
      </div>
    </div>
  );
}
