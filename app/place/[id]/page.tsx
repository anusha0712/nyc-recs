import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLACES, CATEGORY_META, getPlace } from "@/data/places";
import Masthead from "@/components/Masthead";
import PlacePhoto from "@/components/PlacePhoto";
import PriceTag from "@/components/PriceTag";
import OpenNowBadge from "@/components/OpenNowBadge";
import HoursTable from "@/components/HoursTable";
import AddToDayButton from "@/components/AddToDayButton";
import BeenThereStamp from "@/components/BeenThereStamp";

export function generateStaticParams() {
  return PLACES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const place = getPlace(id);
  if (!place) return { title: "Not found — The Daily Bite" };
  return {
    title: `${place.name} — The Daily Bite 🐧`,
    description: place.authorNote.slice(0, 150),
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = getPlace(id);
  if (!place) notFound();

  const meta = CATEGORY_META[place.category];

  return (
    <main className="flex-1">
      <Masthead compact dateline={`The ${meta.label} File`} />

      <article className="mx-auto max-w-2xl px-4 py-5">
        <Link
          href="/recs"
          className="font-mono text-[11px] uppercase tracking-widest text-ink/60 hover:text-hotred"
        >
          ← Back to the recs
        </Link>

        {/* Headline block */}
        <div className="mt-2 flex items-center gap-2">
          <span className="border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide">
            {meta.emoji} {meta.label}
          </span>
          <OpenNowBadge place={place} />
          {place.isFav && (
            <span className="border-2 border-ink bg-taxi px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide">
              ★ Fav
            </span>
          )}
        </div>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] tracking-tight sm:text-6xl">
          {place.name}
        </h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ink/60">
          {place.neighborhood}
          {place.cuisine ? ` · ${place.cuisine}` : ""}
        </p>
        <div className="mt-2">
          <PriceTag level={place.priceLevel} />
        </div>

        {/* Photo */}
        <figure className="relative mt-4 -rotate-1">
          <span className="tape absolute -left-2 -top-3 z-10 h-5 w-20 rotate-6" aria-hidden />
          <div className="paper p-2">
            <PlacePhoto
              place={place}
              className="h-56 w-full border-2 border-ink sm:h-72"
              sizes="(max-width: 640px) 100vw, 600px"
            />
          </div>
        </figure>

        {/* Editor's Note — hidden when there's no note */}
        {place.authorNote.trim() && (
          <section className="relative mt-6 paper bg-taxi/30 p-4 pt-6">
            <span
              className="stamp absolute -right-2 -top-3 z-10 rotate-3 bg-paper px-2 py-1 text-xs opacity-100 mix-blend-normal"
              aria-hidden
            >
              Editor’s Note
            </span>
            <p className="font-serif text-[16px] leading-relaxed">{place.authorNote}</p>
          </section>
        )}

        {/* Tags */}
        {place.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {place.tags.map((t) => (
              <span
                key={t}
                className="border border-ink/40 px-2 py-0.5 font-mono text-[11px] lowercase text-ink/70"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Hours */}
        <section className="mt-6">
          <h2 className="font-display text-2xl uppercase">Hours</h2>
          <div className="paper mt-2 p-3">
            <HoursTable place={place} />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink/40">
              Hours can change — double-check on Google before you go.
            </p>
          </div>
        </section>

        {/* Links */}
        <section className="mt-6 grid gap-2">
          {place.reservationUrl && (
            <LinkRow href={place.reservationUrl} label="Book a table" emoji="🍽️" />
          )}
          {place.website && <LinkRow href={place.website} label="Website" emoji="🔗" />}
          <LinkRow href={place.googleMapsUrl} label="Open in Google Maps" emoji="📍" />
        </section>

        {/* Actions */}
        <div className="sticky bottom-24 mt-6 flex flex-wrap items-center gap-2 border-2 border-ink bg-paper/95 p-3 shadow-[4px_4px_0_0_#141210] backdrop-blur">
          <AddToDayButton placeId={place.id} size="lg" />
          <BeenThereStamp placeId={place.id} size="lg" />
        </div>
      </article>
    </main>
  );
}

function LinkRow({ href, label, emoji }: { href: string; label: string; emoji: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="paper flex items-center justify-between px-4 py-3 transition-transform active:scale-[0.98] hover:-translate-y-0.5"
    >
      <span className="font-mono text-sm font-bold uppercase tracking-wide">
        {emoji} {label}
      </span>
      <span aria-hidden>↗</span>
    </a>
  );
}
