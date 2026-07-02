"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  PLACES,
  CATEGORIES,
  CATEGORY_META,
  type Category,
} from "@/data/places";

// Leaflet touches `window`, so load it browser-only. This ssr:false dynamic
// import is fine here because MapView is itself a Client Component.
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-mono text-sm uppercase tracking-widest text-ink/40">
      Unfolding the map… 🗺️
    </div>
  ),
});

export default function MapView() {
  const [cat, setCat] = useState<Category | "all">("all");

  const places = useMemo(
    () => (cat === "all" ? PLACES : PLACES.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>
          ★ All ({PLACES.length})
        </Chip>
        {CATEGORIES.map((c) => {
          const n = PLACES.filter((p) => p.category === c).length;
          return (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {CATEGORY_META[c].emoji} {CATEGORY_META[c].label} ({n})
            </Chip>
          );
        })}
      </div>

      {/* Map frame */}
      <div className="paper mt-1 flex min-h-0 flex-1 flex-col overflow-hidden p-1.5">
        <div className="relative min-h-[320px] flex-1 overflow-hidden border-2 border-ink">
          <LeafletMap places={places} />
        </div>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-ink/40">
        Tap a pin to peek · pinch to zoom
      </p>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 whitespace-nowrap border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-transform active:scale-95 ${
        active ? "bg-hotpink text-paper shadow-[2px_2px_0_0_#141210]" : "bg-paper"
      }`}
    >
      {children}
    </button>
  );
}
