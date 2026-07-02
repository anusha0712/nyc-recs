import Image from "next/image";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Penguin from "@/components/Penguin";
import { PLACES } from "@/data/places";

// The editor's welcome note lives inline in the JSX below (see "From the Editor").

export default function CoverPage() {
  const stat = {
    spots: PLACES.length,
    hoods: new Set(PLACES.map((p) => p.neighborhood)).size,
  };

  return (
    <main className="flex-1">
      <Masthead />

      <div className="mx-auto max-w-2xl px-4 py-5">
        {/* Front-page banner headline */}
        <div className="flex items-end justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-hotred">
            ★ Special Edition ★
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
            Free · Take one
          </p>
        </div>
        <h2 className="mt-1 font-display text-5xl uppercase leading-[0.9] tracking-tight sm:text-7xl">
          <span className="text-hotpink">Samira &amp; Ava&rsquo;s</span>
          <br />
          NYC Summer!
        </h2>

        {/* Hero photo, framed like a printed front-page photo */}
        <figure className="relative mt-4 -rotate-1">
          <span className="tape absolute -left-3 -top-3 z-10 h-5 w-20 rotate-6" aria-hidden />
          <span className="tape absolute -right-3 -top-3 z-10 h-5 w-20 -rotate-6" aria-hidden />
          <div className="paper p-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-ink">
              <Image
                src="/friends-cover.jpg"
                alt="The two of you, ready for New York"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover"
              />
              <div className="halftone pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
            </div>
            <figcaption className="mt-2 text-center font-serif text-xs italic text-ink/70">
              “Shall I compare thee to a summer’s day? No, a summer’s day is not a
              bitch!” — Nick Miller, circa season 1
            </figcaption>
          </div>
        </figure>

        {/* Editor's welcome note */}
        <section className="relative mt-6 paper -rotate-[0.5deg] p-4 pt-6">
          <span
            className="stamp absolute -right-2 -top-3 z-10 rotate-6 bg-paper px-2 py-1 text-xs opacity-100 mix-blend-normal"
            aria-hidden
          >
            From the Editor
          </span>
          <div>
            {/* Floated so the note wraps around the penguin (right + below). */}
            <Penguin
              className="float-left mr-3 mb-1 h-16 w-14"
              accessory="sunglasses"
              title="Your editor-in-chief"
            />
            <p className="font-serif text-[15px] leading-relaxed">
              Welcome to New York!! 🗽🐧 Here are my favorite recs with helpful
              notes wherever I deemed it necessary! In my attempt to not be an
              inflexible loser, I have provided some space to build your own
              itinerary and move things around per your schedule. I was lazy to
              connect google api for live hours so <em>please</em>{" "}
              double-check times, drag your favorites into a 5-day plan and reach
              out to your friendly neighborhood concierge (me!) to try and snag
              reservations. Tap a penguin when you&rsquo;ve been somewhere &mdash;
              and don&rsquo;t hate my bad vibecode effort ❤️ 💌
            </p>
          </div>
        </section>

        {/* Stat strip */}
        <div className="mt-5 flex items-stretch gap-2 text-center">
          <div className="flex-1 border-2 border-ink bg-taxi px-2 py-2">
            <p className="font-display text-3xl leading-none">{stat.spots}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide">hand-picked spots</p>
          </div>
          <div className="flex-1 border-2 border-ink bg-sky px-2 py-2 text-paper">
            <p className="font-display text-3xl leading-none">{stat.hoods}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide">neighborhoods</p>
          </div>
          <div className="flex-1 border-2 border-ink bg-hotpink px-2 py-2 text-paper">
            <p className="font-display text-3xl leading-none">5</p>
            <p className="font-mono text-[10px] uppercase tracking-wide">days to plan</p>
          </div>
        </div>

        {/* Entry buttons */}
        <nav className="mt-6 grid gap-3">
          <Link
            href="/recs"
            className="paper flex items-center justify-between px-4 py-4 transition-transform active:scale-[0.98] hover:-translate-y-0.5"
          >
            <span className="font-display text-2xl uppercase">Read the Recs</span>
            <span className="text-2xl" aria-hidden>🍕→</span>
          </Link>
          <a
            href="https://nearbycourt.com/worldcup"
            target="_blank"
            rel="noopener noreferrer"
            className="paper flex items-center justify-between bg-hotred px-4 py-4 text-paper transition-transform active:scale-[0.98] hover:-translate-y-0.5"
          >
            <span className="font-display text-2xl uppercase">Watch the World Cup</span>
            <span className="text-2xl" aria-hidden>⚽↗</span>
          </a>
          <Link
            href="/itinerary"
            className="paper flex items-center justify-between bg-park px-4 py-4 text-paper transition-transform active:scale-[0.98] hover:-translate-y-0.5"
          >
            <span className="font-display text-2xl uppercase">Build your trip</span>
            <span className="text-2xl" aria-hidden>🗓️→</span>
          </Link>
          <Link
            href="/map"
            className="paper flex items-center justify-between bg-sky px-4 py-4 text-paper transition-transform active:scale-[0.98] hover:-translate-y-0.5"
          >
            <span className="font-display text-2xl uppercase">See the map</span>
            <span className="text-2xl" aria-hidden>🗺️→</span>
          </Link>
        </nav>

      </div>
    </main>
  );
}
