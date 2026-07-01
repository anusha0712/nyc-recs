import Image from "next/image";
import { CATEGORY_META, type Place } from "@/data/places";

// Full class strings so Tailwind's JIT can see them (no dynamic concatenation).
const CATEGORY_BG: Record<string, string> = {
  hotred: "bg-hotred",
  hotpink: "bg-hotpink",
  grape: "bg-grape",
  sky: "bg-sky",
  park: "bg-park",
  taxi: "bg-taxi",
};

// Shows the place photo when we have one, otherwise a bold halftone color block
// stamped with the category emoji — keeps the grid lively before photos land.
export default function PlacePhoto({
  place,
  className = "",
  sizes = "(max-width: 640px) 100vw, 320px",
}: {
  place: Place;
  className?: string;
  sizes?: string;
}) {
  const meta = CATEGORY_META[place.category];

  if (place.photo) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={place.photo}
          alt={place.name}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${CATEGORY_BG[meta.color] ?? "bg-sky"} ${className}`}
    >
      <div className="halftone absolute inset-0 opacity-20" aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.25)]" aria-hidden>
          {meta.emoji}
        </span>
      </div>
    </div>
  );
}
