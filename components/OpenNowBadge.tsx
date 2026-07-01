"use client";

import { useEffect, useState } from "react";
import { isOpenNow } from "@/lib/hours";
import type { Place } from "@/data/places";

// Computed from NY wall-clock, so it must run client-side after mount to avoid
// an SSR/CSR mismatch. Renders a neutral placeholder until then.
export default function OpenNowBadge({
  place,
  className = "",
}: {
  place: Place;
  className?: string;
}) {
  const [state, setState] = useState<ReturnType<typeof isOpenNow> | null>(null);

  useEffect(() => {
    // Client-only: open/closed depends on NY wall-clock, resolved after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(isOpenNow(place));
    const t = setInterval(() => setState(isOpenNow(place)), 60_000);
    return () => clearInterval(t);
  }, [place]);

  if (!state) {
    return (
      <span
        className={`inline-flex items-center gap-1 border-2 border-ink px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide bg-newsprint/40 ${className}`}
      >
        · · ·
      </span>
    );
  }

  const tone = state.open
    ? state.closingSoon
      ? "bg-taxi text-ink"
      : "bg-park text-paper"
    : "bg-ink text-paper";

  return (
    <span
      className={`inline-flex items-center gap-1 border-2 border-ink px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide ${tone} ${className}`}
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${state.open ? "bg-paper" : "bg-hotred"}`}
        aria-hidden
      />
      {state.label}
    </span>
  );
}
