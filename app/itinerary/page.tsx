import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import ItineraryBuilder from "@/components/itinerary/ItineraryBuilder";

export const metadata: Metadata = {
  title: "Build Your Trip — The Daily Waddle 🐧",
  description: "Drag your favorite NYC spots into a 4-day plan, then share it or add it to your calendar.",
};

export default async function ItineraryPage({
  searchParams,
}: {
  searchParams: Promise<{ trip?: string }>;
}) {
  const { trip } = await searchParams;

  return (
    <main className="flex-1">
      <Masthead compact dateline="Section B · Your Itinerary" />
      <div className="mx-auto max-w-2xl px-4 py-5">
        <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">
          Plan the <span className="text-park">4 days</span>
        </h2>
        <p className="mt-1 font-serif italic text-ink/70">
          It saves automatically on this device. Rearrange until it’s perfect.
        </p>
        <div className="mt-4">
          <ItineraryBuilder sharedParam={trip} />
        </div>
      </div>
    </main>
  );
}
