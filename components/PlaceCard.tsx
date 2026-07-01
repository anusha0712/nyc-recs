import Link from "next/link";
import { CATEGORY_META, type Place } from "@/data/places";
import PlacePhoto from "@/components/PlacePhoto";
import PenguinRating from "@/components/PenguinRating";
import PriceTag from "@/components/PriceTag";
import OpenNowBadge from "@/components/OpenNowBadge";
import AddToDayButton from "@/components/AddToDayButton";
import BeenThereStamp from "@/components/BeenThereStamp";

// Alternating slight tilt so the grid reads like pinned newspaper clippings.
const TILTS = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-2", "rotate-2"];

export default function PlaceCard({
  place,
  index = 0,
}: {
  place: Place;
  index?: number;
}) {
  const meta = CATEGORY_META[place.category];
  const tilt = TILTS[index % TILTS.length];

  return (
    <article
      className={`paper relative ${tilt} transition-transform duration-150 hover:rotate-0 hover:-translate-y-0.5`}
    >
      {/* tape strip */}
      <span
        className="tape absolute -top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 -rotate-2"
        aria-hidden
      />

      <Link href={`/place/${place.id}`} className="block">
        <div className="relative">
          <PlacePhoto place={place} className="h-40 w-full border-b-2 border-ink" />
          <span className="absolute left-2 top-2 border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide">
            {meta.emoji} {meta.label}
          </span>
          <span className="absolute right-2 top-2">
            <OpenNowBadge place={place} />
          </span>
        </div>

        <div className="p-3">
          <h3 className="font-display text-2xl leading-none uppercase tracking-tight">
            {place.name}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink/60">
            {place.neighborhood}
            {place.cuisine ? ` · ${place.cuisine}` : ""}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <PenguinRating rating={place.penguinRating} />
            <PriceTag level={place.priceLevel} />
          </div>

          {place.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {place.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="border border-ink/40 px-1.5 py-0.5 font-mono text-[10px] lowercase text-ink/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-2 border-t-2 border-dashed border-ink/40 p-3 pt-2">
        <AddToDayButton placeId={place.id} />
        <BeenThereStamp placeId={place.id} />
      </div>
    </article>
  );
}
