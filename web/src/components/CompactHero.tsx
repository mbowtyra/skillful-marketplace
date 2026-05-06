"use client";

export default function CompactHero() {
  return (
    <section className="relative overflow-hidden" style={{ height: 100 }}>
      <div className="absolute inset-0">
        <img
          src="/illustrations/marbled-endpaper.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.45 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
