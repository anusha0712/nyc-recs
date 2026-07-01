// Author's personal rating, out of 5 penguins.

export default function PenguinRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const full = Math.round(rating);
  const cls = size === "lg" ? "text-2xl" : "text-sm";
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${cls}`}
      role="img"
      aria-label={`${full} out of 5 penguins`}
      title={`${full}/5 penguins`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "" : "opacity-25 grayscale"} aria-hidden>
          🐧
        </span>
      ))}
    </span>
  );
}
