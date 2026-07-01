import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import MapView from "@/components/map/MapView";

export const metadata: Metadata = {
  title: "The Map — The Daily Waddle 🐧",
  description: "Every hand-picked NYC spot, pinned on the map.",
};

export default function MapPage() {
  return (
    <main className="flex-1">
      <Masthead compact dateline="Section C · The Map" />
      <div className="mx-auto max-w-2xl px-4 py-5">
        <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">
          The <span className="text-sky">Map</span> Room
        </h2>
        <p className="mt-1 mb-3 font-serif italic text-ink/70">
          The whole city, pinned. Filter by what you’re in the mood for.
        </p>
        <MapView />
      </div>
    </main>
  );
}
