export function VineDividerSVG({ width = 600 }: { width?: number }) {
  return (
    <svg
      width="100%" height="56" viewBox="0 0 600 56"
      preserveAspectRatio="xMidYMid meet" fill="none"
      className="mx-auto"
      style={{ maxWidth: width }}
      aria-hidden="true"
    >
      {/* Main vine stem - left */}
      <path d="M0 28 C30 20, 50 36, 80 28 C110 20, 130 36, 160 28 C190 20, 210 36, 240 28 C255 24, 270 22, 285 24" stroke="#5a7247" strokeWidth="1.5" />
      {/* Main vine stem - right */}
      <path d="M315 24 C330 22, 345 24, 360 28 C390 36, 410 20, 440 28 C470 36, 490 20, 520 28 C550 36, 570 20, 600 28" stroke="#5a7247" strokeWidth="1.5" />

      {/* Acanthus leaves left side */}
      <path d="M40 26 C34 18, 28 14, 24 16 C20 18, 22 24, 28 26 C24 22, 22 18, 26 16" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.6" />
      <path d="M40 26 C38 20, 34 16, 30 18" stroke="#7a9a60" strokeWidth="0.4" fill="none" />
      <path d="M80 30 C86 38, 92 42, 96 40 C100 38, 98 32, 92 30 C96 34, 98 38, 94 40" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.6" />
      <path d="M120 26 C114 18, 108 14, 104 18 C100 22, 104 26, 110 26" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.6" />
      <path d="M160 30 C166 38, 170 42, 174 40 C178 36, 174 30, 168 30" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.6" />
      <path d="M200 26 C194 18, 190 16, 186 20 C184 24, 188 26, 194 26" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.6" />

      {/* Acanthus leaves right side */}
      <path d="M400 26 C406 18, 412 14, 416 16 C420 18, 418 24, 412 26" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.6" />
      <path d="M440 30 C434 38, 428 42, 424 40 C420 36, 424 30, 430 30" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.6" />
      <path d="M480 26 C486 18, 490 16, 494 20 C496 24, 492 26, 486 26" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.6" />
      <path d="M520 30 C514 38, 510 42, 506 40 C502 36, 506 30, 512 30" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.6" />
      <path d="M560 26 C566 18, 572 14, 576 16 C580 18, 578 24, 572 26" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.6" />

      {/* Flowers - left */}
      <circle cx="60" cy="22" r="4" fill="#b04050" stroke="#803040" strokeWidth="0.6" />
      <circle cx="60" cy="22" r="2" fill="#d06070" stroke="none" />
      <circle cx="60" cy="22" r="1" fill="#cfb53b" />
      <circle cx="140" cy="34" r="3.5" fill="#4060a0" stroke="#304080" strokeWidth="0.6" />
      <circle cx="140" cy="34" r="1.5" fill="#6080c0" stroke="none" />
      <circle cx="140" cy="34" r="0.8" fill="#cfb53b" />
      <circle cx="220" cy="22" r="4" fill="#b04050" stroke="#803040" strokeWidth="0.6" />
      <circle cx="220" cy="22" r="2" fill="#d06070" stroke="none" />
      <circle cx="220" cy="22" r="1" fill="#cfb53b" />

      {/* Flowers - right */}
      <circle cx="380" cy="22" r="4" fill="#b04050" stroke="#803040" strokeWidth="0.6" />
      <circle cx="380" cy="22" r="2" fill="#d06070" stroke="none" />
      <circle cx="380" cy="22" r="1" fill="#cfb53b" />
      <circle cx="460" cy="34" r="3.5" fill="#4060a0" stroke="#304080" strokeWidth="0.6" />
      <circle cx="460" cy="34" r="1.5" fill="#6080c0" stroke="none" />
      <circle cx="460" cy="34" r="0.8" fill="#cfb53b" />
      <circle cx="540" cy="22" r="4" fill="#b04050" stroke="#803040" strokeWidth="0.6" />
      <circle cx="540" cy="22" r="2" fill="#d06070" stroke="none" />
      <circle cx="540" cy="22" r="1" fill="#cfb53b" />

      {/* Berries scattered */}
      <circle cx="100" cy="24" r="2" fill="#c44030" stroke="#8a2020" strokeWidth="0.4" />
      <circle cx="104" cy="22" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.4" />
      <circle cx="180" cy="32" r="2" fill="#c44030" stroke="#8a2020" strokeWidth="0.4" />
      <circle cx="184" cy="34" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.4" />
      <circle cx="420" cy="24" r="2" fill="#c44030" stroke="#8a2020" strokeWidth="0.4" />
      <circle cx="416" cy="22" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.4" />
      <circle cx="500" cy="32" r="2" fill="#c44030" stroke="#8a2020" strokeWidth="0.4" />
      <circle cx="496" cy="34" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.4" />

      {/* Small curling tendrils */}
      <path d="M50 30 C48 34, 44 36, 42 34 C40 32, 42 28, 46 28" stroke="#5a7247" strokeWidth="0.6" fill="none" />
      <path d="M170 22 C172 18, 176 16, 178 18 C180 20, 178 24, 174 24" stroke="#5a7247" strokeWidth="0.6" fill="none" />
      <path d="M430 30 C432 34, 436 36, 438 34 C440 32, 438 28, 434 28" stroke="#5a7247" strokeWidth="0.6" fill="none" />
      <path d="M550 22 C548 18, 544 16, 542 18 C540 20, 542 24, 546 24" stroke="#5a7247" strokeWidth="0.6" fill="none" />

      {/* Center medallion */}
      <circle cx="300" cy="28" r="14" fill="#8B2500" stroke="#6B1A00" strokeWidth="1.2" />
      <circle cx="300" cy="28" r="11" fill="none" stroke="#cfb53b" strokeWidth="0.8" />
      {/* Fleur-de-lis inside medallion */}
      <path d="M300 18 C298 22, 296 24, 294 24 C292 24, 292 22, 294 20 C296 18, 298 16, 300 18Z" fill="#cfb53b" />
      <path d="M300 18 C302 22, 304 24, 306 24 C308 24, 308 22, 306 20 C304 18, 302 16, 300 18Z" fill="#cfb53b" />
      <path d="M300 18 L300 36" stroke="#cfb53b" strokeWidth="1.5" />
      <path d="M296 34 L300 38 L304 34" stroke="#cfb53b" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function PageHeaderOrnament() {
  return (
    <div className="flex items-center gap-3 mt-4" aria-hidden="true">
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none">
        {/* Flowing vine */}
        <path d="M0 12 C10 6, 20 18, 30 12 C40 6, 50 18, 60 12 C70 6, 80 18, 90 12 C100 6, 110 18, 120 12" stroke="#5a7247" strokeWidth="1" />
        {/* Leaves */}
        <path d="M15 10 C12 6, 8 6, 10 10" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M35 14 C38 18, 42 18, 40 14" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M55 10 C52 6, 48 6, 50 10" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M75 14 C78 18, 82 18, 80 14" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M95 10 C92 6, 88 6, 90 10" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M105 14 C108 18, 112 18, 110 14" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.4" />
        {/* Flowers */}
        <circle cx="25" cy="8" r="2.5" fill="#b04050" stroke="#803040" strokeWidth="0.4" />
        <circle cx="25" cy="8" r="1" fill="#cfb53b" />
        <circle cx="65" cy="16" r="2.5" fill="#4060a0" stroke="#304080" strokeWidth="0.4" />
        <circle cx="65" cy="16" r="1" fill="#cfb53b" />
        <circle cx="105" cy="8" r="2.5" fill="#b04050" stroke="#803040" strokeWidth="0.4" />
        <circle cx="105" cy="8" r="1" fill="#cfb53b" />
        {/* Berries */}
        <circle cx="45" cy="8" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
        <circle cx="48" cy="7" r="1" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
        <circle cx="85" cy="16" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
        <circle cx="82" cy="17" r="1" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      </svg>
      {/* Center diamond */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="#cfb53b" stroke="#8a7020" strokeWidth="0.6" opacity="0.6" />
        <circle cx="8" cy="8" r="2" fill="#8B2500" opacity="0.7" />
      </svg>
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" style={{ transform: "scaleX(-1)" }}>
        <path d="M0 12 C10 6, 20 18, 30 12 C40 6, 50 18, 60 12 C70 6, 80 18, 90 12 C100 6, 110 18, 120 12" stroke="#5a7247" strokeWidth="1" />
        <path d="M15 10 C12 6, 8 6, 10 10" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M35 14 C38 18, 42 18, 40 14" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M55 10 C52 6, 48 6, 50 10" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M75 14 C78 18, 82 18, 80 14" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M95 10 C92 6, 88 6, 90 10" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.4" />
        <path d="M105 14 C108 18, 112 18, 110 14" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.4" />
        <circle cx="25" cy="8" r="2.5" fill="#b04050" stroke="#803040" strokeWidth="0.4" />
        <circle cx="25" cy="8" r="1" fill="#cfb53b" />
        <circle cx="65" cy="16" r="2.5" fill="#4060a0" stroke="#304080" strokeWidth="0.4" />
        <circle cx="65" cy="16" r="1" fill="#cfb53b" />
        <circle cx="105" cy="8" r="2.5" fill="#b04050" stroke="#803040" strokeWidth="0.4" />
        <circle cx="105" cy="8" r="1" fill="#cfb53b" />
        <circle cx="45" cy="8" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
        <circle cx="48" cy="7" r="1" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
        <circle cx="85" cy="16" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
        <circle cx="82" cy="17" r="1" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      </svg>
    </div>
  );
}

export function MarginVine({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <svg
      width="32" height="400" viewBox="0 0 32 400" fill="none"
      className={`absolute top-1/2 -translate-y-1/2 hidden lg:block ${isLeft ? "-left-2" : "-right-2"}`}
      style={{ opacity: 0.25 }}
      aria-hidden="true"
    >
      {/* Main vine stem */}
      <path d="M16 0 C16 30, 12 50, 16 80 C20 110, 12 140, 16 170 C20 200, 12 230, 16 260 C20 290, 12 320, 16 350 C16 370, 16 390, 16 400" stroke="#5a7247" strokeWidth="1.5" />

      {/* Acanthus leaves */}
      <path d="M16 40 C8 34, 4 30, 6 36 C8 42, 14 42, 16 40Z" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.5" />
      <path d="M16 100 C24 94, 28 90, 26 96 C24 102, 18 102, 16 100Z" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.5" />
      <path d="M16 160 C8 154, 4 150, 6 156 C8 162, 14 162, 16 160Z" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.5" />
      <path d="M16 220 C24 214, 28 210, 26 216 C24 222, 18 222, 16 220Z" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.5" />
      <path d="M16 280 C8 274, 4 270, 6 276 C8 282, 14 282, 16 280Z" fill="#6a8a50" stroke="#4a6a30" strokeWidth="0.5" />
      <path d="M16 340 C24 334, 28 330, 26 336 C24 342, 18 342, 16 340Z" fill="#5a7a40" stroke="#4a6a30" strokeWidth="0.5" />

      {/* Flowers */}
      <circle cx="8" cy="70" r="4" fill="#b04050" stroke="#803040" strokeWidth="0.5" />
      <circle cx="8" cy="70" r="2" fill="#d06070" />
      <circle cx="8" cy="70" r="1" fill="#cfb53b" />
      <circle cx="24" cy="190" r="4" fill="#4060a0" stroke="#304080" strokeWidth="0.5" />
      <circle cx="24" cy="190" r="2" fill="#6080c0" />
      <circle cx="24" cy="190" r="1" fill="#cfb53b" />
      <circle cx="8" cy="310" r="4" fill="#b04050" stroke="#803040" strokeWidth="0.5" />
      <circle cx="8" cy="310" r="2" fill="#d06070" />
      <circle cx="8" cy="310" r="1" fill="#cfb53b" />

      {/* Berries */}
      <circle cx="22" cy="130" r="2" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      <circle cx="24" cy="134" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      <circle cx="20" cy="133" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      <circle cx="10" cy="250" r="2" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      <circle cx="8" cy="254" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      <circle cx="12" cy="253" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      <circle cx="22" cy="370" r="2" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />
      <circle cx="24" cy="374" r="1.5" fill="#c44030" stroke="#8a2020" strokeWidth="0.3" />

      {/* Curling tendrils */}
      <path d="M16 60 C10 58, 6 60, 8 64 C10 68, 14 66, 14 62" stroke="#5a7247" strokeWidth="0.6" fill="none" />
      <path d="M16 180 C22 178, 26 180, 24 184 C22 188, 18 186, 18 182" stroke="#5a7247" strokeWidth="0.6" fill="none" />
      <path d="M16 300 C10 298, 6 300, 8 304 C10 308, 14 306, 14 302" stroke="#5a7247" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

export function FooterVine() {
  return (
    <svg width="300" height="32" viewBox="0 0 300 32" fill="none" className="mx-auto" aria-hidden="true">
      {/* Vine */}
      <path d="M0 16 C20 8, 40 24, 60 16 C80 8, 100 24, 120 16 C140 8, 155 16, 150 16 L150 16 C145 16, 160 24, 180 16 C200 8, 220 24, 240 16 C260 8, 280 24, 300 16" stroke="#5a7247" strokeWidth="1" opacity="0.5" />
      {/* Leaves */}
      <path d="M30 12 C26 8, 22 8, 24 12" fill="#6a8a50" opacity="0.4" stroke="#4a6a30" strokeWidth="0.3" />
      <path d="M90 20 C94 24, 98 24, 96 20" fill="#5a7a40" opacity="0.4" stroke="#4a6a30" strokeWidth="0.3" />
      <path d="M210 12 C206 8, 202 8, 204 12" fill="#6a8a50" opacity="0.4" stroke="#4a6a30" strokeWidth="0.3" />
      <path d="M270 20 C274 24, 278 24, 276 20" fill="#5a7a40" opacity="0.4" stroke="#4a6a30" strokeWidth="0.3" />
      {/* Center ornament */}
      <circle cx="150" cy="16" r="5" fill="#8B2500" opacity="0.4" />
      <circle cx="150" cy="16" r="3" fill="#cfb53b" opacity="0.4" />
      {/* Flowers */}
      <circle cx="60" cy="12" r="2.5" fill="#b04050" opacity="0.35" stroke="none" />
      <circle cx="60" cy="12" r="1" fill="#cfb53b" opacity="0.4" />
      <circle cx="240" cy="12" r="2.5" fill="#b04050" opacity="0.35" stroke="none" />
      <circle cx="240" cy="12" r="1" fill="#cfb53b" opacity="0.4" />
    </svg>
  );
}

export function ScrollworkBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true" />
  );
}
