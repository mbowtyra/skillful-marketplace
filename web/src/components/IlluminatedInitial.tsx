import Image from "next/image";

interface IlluminatedInitialProps {
  letter: string;
  size?: number;
}

const AVAILABLE_INITIALS: Record<string, string> = {
  O: "/illustrations/initials/O.png",
  Y: "/illustrations/initials/Y.png",
  F: "/illustrations/initials/F.png",
  M: "/illustrations/initials/M.png",
};

export default function IlluminatedInitial({ letter, size = 48 }: IlluminatedInitialProps) {
  const imagePath = AVAILABLE_INITIALS[letter];

  if (!imagePath) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-sm align-middle mr-1.5 flex-shrink-0"
        style={{
          width: size,
          height: size,
          fontFamily: "var(--font-display)",
          fontSize: size * 0.6,
          color: "var(--gold)",
          background: "#1e3570",
          border: "2px solid var(--gold)",
        }}
      >
        {letter}
      </span>
    );
  }

  return (
    <Image
      src={imagePath}
      alt={`Illuminated letter ${letter}`}
      width={size}
      height={size}
      className="inline-block align-middle -mr-0.5 flex-shrink-0"
      unoptimized
    />
  );
}
