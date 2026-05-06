export interface Avatar {
  id: string;
  label: string;
  category: "marginalia" | "bestiary";
  bgColor: string;
  imagePath: string;
}

export const AVATARS: Avatar[] = [
  { id: "mandrake", label: "Mandrake Root", category: "marginalia", bgColor: "#d4c9a8", imagePath: "/illustrations/avatars/mandrake.png" },
  { id: "fish-noble", label: "Fish Noble", category: "marginalia", bgColor: "#c4a882", imagePath: "/illustrations/avatars/fish-noble.png" },
  { id: "wind-face", label: "Wind Face", category: "marginalia", bgColor: "#d4c4a8", imagePath: "/illustrations/avatars/wind-face.png" },
  { id: "snail-knight", label: "Snail Knight", category: "marginalia", bgColor: "#a8b898", imagePath: "/illustrations/avatars/snail-knight.png" },
  { id: "fox-monk", label: "Fox Monk", category: "marginalia", bgColor: "#c4a878", imagePath: "/illustrations/avatars/fox-monk.png" },
  { id: "scribe", label: "Scribe", category: "marginalia", bgColor: "#b0a088", imagePath: "/illustrations/avatars/scribe.png" },
  { id: "crowned-bird", label: "Crowned Bird", category: "bestiary", bgColor: "#c4b898", imagePath: "/illustrations/avatars/crowned-bird.png" },
  { id: "unicorn", label: "Unicorn", category: "bestiary", bgColor: "#8aaa78", imagePath: "/illustrations/avatars/unicorn.png" },
];

export function getAvatar(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}
