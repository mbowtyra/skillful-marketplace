"use client";

import { useState } from "react";
import Image from "next/image";
import { AVATARS, type Avatar } from "@/lib/avatars";

interface AvatarPickerProps {
  currentAvatarId: string;
  onSelect: (avatar: Avatar) => void;
  onClose: () => void;
}

export default function AvatarPicker({ currentAvatarId, onSelect, onClose }: AvatarPickerProps) {
  const [selected, setSelected] = useState(currentAvatarId);

  const marginalia = AVATARS.filter((a) => a.category === "marginalia");
  const bestiary = AVATARS.filter((a) => a.category === "bestiary");

  const handleSave = () => {
    const avatar = AVATARS.find((a) => a.id === selected);
    if (avatar) onSelect(avatar);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overlay-fade"
      style={{ background: "rgba(15, 11, 7, 0.6)" }}
      onClick={onClose}
    >
      <div
        className="detail-panel w-full max-w-md mx-4 rounded-xl overflow-hidden"
        style={{ background: "var(--parchment)", border: "1px solid var(--gray-200)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2
            className="text-xl mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
          >
            Choose Your Avatar
          </h2>
          <p className="text-[13px] mb-5" style={{ color: "var(--gray-500)" }}>
            Pick a medieval companion to represent you
          </p>

          <p className="text-[11px] font-semibold tracking-[2px] uppercase mb-3" style={{ color: "var(--gold)" }}>
            Marginalia
          </p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {marginalia.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelected(avatar.id)}
                className="w-full aspect-square rounded-lg overflow-hidden transition-all duration-200 cursor-pointer"
                style={{
                  border: selected === avatar.id ? "3px solid var(--gold)" : "3px solid transparent",
                  transform: selected === avatar.id ? "scale(1.05)" : "scale(1)",
                  boxShadow: selected === avatar.id ? "0 4px 16px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.1)",
                }}
                aria-label={avatar.label}
              >
                <Image
                  src={avatar.imagePath}
                  alt={avatar.label}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>

          <p className="text-[11px] font-semibold tracking-[2px] uppercase mb-3" style={{ color: "var(--gold)" }}>
            Bestiary
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {bestiary.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelected(avatar.id)}
                className="w-full aspect-square rounded-lg overflow-hidden transition-all duration-200 cursor-pointer"
                style={{
                  border: selected === avatar.id ? "3px solid var(--gold)" : "3px solid transparent",
                  transform: selected === avatar.id ? "scale(1.05)" : "scale(1)",
                  boxShadow: selected === avatar.id ? "0 4px 16px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.1)",
                }}
                aria-label={avatar.label}
              >
                <Image
                  src={avatar.imagePath}
                  alt={avatar.label}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 cursor-pointer hover:brightness-110"
              style={{ background: "var(--manuscript-red)" }}
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer"
              style={{ color: "var(--gray-600)", border: "1px solid var(--gray-200)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
