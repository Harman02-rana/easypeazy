const PALETTE = [
  { text: "var(--cat-applications)", bg: "var(--cat-applications-bg)" },
  { text: "var(--cat-study)", bg: "var(--cat-study-bg)" },
  { text: "var(--cat-interview)", bg: "var(--cat-interview-bg)" },
  { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" },
  { text: "var(--cat-planner)", bg: "var(--cat-planner-bg)" },
  { text: "var(--cat-sister)", bg: "var(--cat-sister-bg)" },
];

/** Same company name always lands on the same tint, so repeat visits of
 * "Boeing" don't randomly flicker between colors across renders. */
function paletteFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function CompanyAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md";
}) {
  const { text, bg } = paletteFor(name);
  const dimension = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg font-semibold ${dimension}`}
      style={{ backgroundColor: bg, color: text }}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
