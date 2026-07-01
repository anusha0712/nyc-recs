import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import RecsBrowser from "@/components/RecsBrowser";

export const metadata: Metadata = {
  title: "The Recs — The Daily Waddle 🐧",
  description: "Every hand-picked NYC spot: filter by vibe, cuisine, neighborhood and more.",
};

export default function RecsPage() {
  return (
    <main className="flex-1">
      <Masthead compact dateline="Section A · The Recs" />
      <div className="mx-auto max-w-2xl px-4 py-5">
        <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">
          The <span className="text-hotred">Recs</span> Desk
        </h2>
        <p className="mt-1 font-serif italic text-ink/70">
          Everywhere I’d send you, all in one place. Tap a headline to read more.
        </p>
        <div className="mt-4">
          <RecsBrowser />
        </div>
      </div>
    </main>
  );
}
