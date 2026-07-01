import Link from "next/link";
import { CATEGORY_META, type Place } from "@/data/places";
import PriceTag from "@/components/PriceTag";
import OpenNowBadge from "@/components/OpenNowBadge";
import AddToDayButton from "@/components/AddToDayButton";
import BeenThereStamp from "@/components/BeenThereStamp";

// Full class strings so Tailwind's JIT sees them (no dynamic concatenation).
const CATEGORY_BG: Record<string, string> = {
  hotred: "bg-hotred",
  hotpink: "bg-hotpink",
  grape: "bg-grape",
  sky: "bg-sky",
  park: "bg-park",
  taxi: "bg-taxi",
};

// Alternating slight tilt so the grid reads like pinned newspaper clippings.
const TILTS = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-1", "rotate-1"];

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
      className={`paper relative ${tilt} p-3 transition-transform duration-150 hover:rotate-0 hover:-translate-y-0.5`}
    >
      {place.isFav && (
        <span
          className="stamp absolute -right-2 -top-3 z-10 rotate-6 bg-paper px-2 py-0.5 text-[11px] opacity-100 mix-blend-normal"
          aria-label="Anusha's favorite"
        >
          ★ Fav
        </span>
      )}

      <Link href={`/place/${place.id}`} className="block">
        <div className="flex items-start gap-2.5">
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center border-2 border-ink text-lg ${
              CATEGORY_BG[meta.color] ?? "bg-sky"
            }`}
            aria-hidden
          >
            {meta.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl leading-[0.95] uppercase text-ink">
              {place.name}
            </h3>
            <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-wide text-ink/70">
              {place.neighborhood}
              {place.cuisine ? ` · ${place.cuisine}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <OpenNowBadge place={place} />
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
      </Link>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-ink/30 pt-2.5">
        <AddToDayButton placeId={place.id} />
        <BeenThereStamp placeId={place.id} />
      </div>
    </article>
  );
}
