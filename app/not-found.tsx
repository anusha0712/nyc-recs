import Link from "next/link";
import Penguin from "@/components/Penguin";
import Masthead from "@/components/Masthead";

export default function NotFound() {
  return (
    <main className="flex-1">
      <Masthead compact dateline="Stop the presses!" />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center">
        <Penguin className="h-28 w-24" accessory="map" title="A lost penguin" />
        <h1 className="mt-4 font-display text-6xl uppercase leading-none">404</h1>
        <p className="mt-2 font-serif text-lg italic text-ink/70">
          This page waddled off somewhere. Even the penguin can’t find it.
        </p>
        <Link
          href="/"
          className="paper mt-6 bg-taxi px-5 py-3 font-display text-2xl uppercase transition-transform active:scale-95"
        >
          Back to the cover →
        </Link>
      </div>
    </main>
  );
}
