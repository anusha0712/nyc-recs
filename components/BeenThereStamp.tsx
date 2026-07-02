"use client";

import { useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { useBeenThere } from "@/lib/storage";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BeenThereStamp({
  placeId,
  size = "sm",
  fullWidth = false,
}: {
  placeId: string;
  size?: "sm" | "lg";
  fullWidth?: boolean;
}) {
  const { has, toggle, hydrated } = useBeenThere();
  const ref = useRef<HTMLButtonElement>(null);
  const stamped = has(placeId);

  const onClick = useCallback(() => {
    const wasStamped = has(placeId);
    toggle(placeId);
    if (!wasStamped && !prefersReducedMotion() && ref.current) {
      const r = ref.current.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 70,
        startVelocity: 32,
        scalar: 0.9,
        ticks: 120,
        origin: {
          x: (r.left + r.width / 2) / window.innerWidth,
          y: (r.top + r.height / 2) / window.innerHeight,
        },
        colors: ["#ffcf24", "#ff3b2f", "#ff4d9d", "#1fa562", "#2ea6e6"],
      });
    }
  }, [has, toggle, placeId]);

  const base =
    size === "lg" ? "min-h-[48px] px-4 text-base" : "min-h-[40px] px-3 text-xs";

  if (!hydrated) {
    return (
      <span
        className={`inline-flex items-center justify-center border-2 border-ink bg-newsprint/40 font-mono uppercase tracking-wide ${base} ${
          fullWidth ? "w-full" : ""
        }`}
      >
        · · ·
      </span>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={stamped}
      className={`inline-flex items-center justify-center gap-1.5 border-2 border-ink font-mono font-bold uppercase tracking-wide transition-transform active:scale-90 ${base} ${
        fullWidth ? "w-full" : ""
      } ${
        stamped ? "bg-hotpink text-paper -rotate-2" : "bg-paper text-ink hover:bg-cream"
      }`}
    >
      {stamped ? "🐧 Been there!" : "○ Been there?"}
    </button>
  );
}
