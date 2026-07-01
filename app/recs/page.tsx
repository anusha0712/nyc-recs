import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import RecsBrowser from "@/components/RecsBrowser";

export const metadata: Metadata = {
  title: "The Recs — The Daily Bite 🐧",
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

        <section className="relative mt-4 paper bg-hotred/10 p-4 pt-5">
          <span
            className="stamp absolute -left-2 -top-3 z-10 -rotate-3 bg-paper px-2 py-0.5 text-xs opacity-100 mix-blend-normal"
            aria-hidden
          >
            Caveats
          </span>
          <p className="font-serif text-[14px] leading-relaxed">
            I have no Thai recs since I do not enjoy that. I also, unfortunately,
            cannot provide queer space recommendations with great confidence. I will
            leave both to our more in-the-know friends. In a pinch, outdoor/day
            drinking is best accomplished by walking around West Village, Marks Pl or
            LES (college-y). PLEASE do not go to Adda for Indian food, everything
            tastes the same and it&rsquo;s not worth it - the Queens location was
            better but it closed down.
          </p>
        </section>

        <div className="mt-5">
          <RecsBrowser />
        </div>
      </div>
    </main>
  );
}
