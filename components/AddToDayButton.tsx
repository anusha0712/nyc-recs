"use client";

import { useState } from "react";
import { useItinerary, NUM_DAYS } from "@/lib/storage";

// Compact control: shows current day assignment; tap to open a day picker.
export default function AddToDayButton({
  placeId,
  size = "sm",
}: {
  placeId: string;
  size?: "sm" | "lg";
}) {
  const { addToDay, removeFromDay, dayForPlace, hydrated } = useItinerary();
  const [open, setOpen] = useState(false);
  const currentDay = dayForPlace(placeId);

  const base =
    size === "lg"
      ? "min-h-[48px] px-4 text-base"
      : "min-h-[40px] px-3 text-xs";

  if (!hydrated) {
    return (
      <span
        className={`inline-flex items-center justify-center border-2 border-ink bg-newsprint/40 font-mono uppercase tracking-wide ${base}`}
      >
        · · ·
      </span>
    );
  }

  const inTrip = currentDay !== null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 border-2 border-ink font-mono font-bold uppercase tracking-wide transition-transform active:scale-95 ${base} ${
          inTrip ? "bg-park text-paper" : "bg-taxi text-ink"
        }`}
      >
        {inTrip ? `✓ Day ${currentDay! + 1}` : "＋ Add to trip"}
      </button>

      {/* Day picker as a bottom sheet so it's never clipped by the fixed nav. */}
      {open && (
        <>
          <button
            type="button"
            aria-label="Close day picker"
            className="fixed inset-0 z-[55] cursor-default bg-ink/30"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Add to which day"
            className="fixed inset-x-3 bottom-24 z-[60] mx-auto max-w-sm border-2 border-ink bg-paper p-3 shadow-[4px_4px_0_0_#141210]"
          >
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wide text-ink/70">
              Add to which day?
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: NUM_DAYS }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    addToDay(i, placeId);
                    setOpen(false);
                  }}
                  className={`min-h-[48px] border-2 border-ink font-display text-xl transition-transform active:scale-95 ${
                    currentDay === i ? "bg-park text-paper" : "bg-cream hover:bg-taxi"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            {inTrip && (
              <button
                type="button"
                onClick={() => {
                  removeFromDay(currentDay!, placeId);
                  setOpen(false);
                }}
                className="mt-2 w-full min-h-[40px] border-2 border-hotred font-mono text-xs font-bold uppercase text-hotred transition-transform active:scale-95"
              >
                Remove from trip
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
