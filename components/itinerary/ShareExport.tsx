"use client";

import { useState } from "react";
import type { Itinerary } from "@/lib/storage";
import { buildShareUrl, itineraryIsEmpty } from "@/lib/share";
import { downloadIcs } from "@/lib/ics";

export default function ShareExport({ itinerary }: { itinerary: Itinerary }) {
  const [copied, setCopied] = useState(false);
  const [startDate, setStartDate] = useState("");
  const empty = itineraryIsEmpty(itinerary);

  const share = async () => {
    const url = buildShareUrl(itinerary, window.location.origin);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Our NYC trip 🐧",
          text: "Here's the plan I built on The Daily Bite!",
          url,
        });
        return;
      }
    } catch {
      /* user cancelled native share — fall through to copy */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your trip link:", url);
    }
  };

  const exportIcs = () => {
    // Local date from the yyyy-mm-dd input (avoids UTC off-by-one).
    const [y, m, d] = startDate.split("-").map(Number);
    const start = startDate ? new Date(y, m - 1, d) : new Date();
    downloadIcs(itinerary, start);
  };

  if (empty) return null;

  return (
    <section className="mt-8 paper bg-grape/10 p-4">
      <h2 className="font-display text-2xl uppercase">Take it with you</h2>

      <button
        type="button"
        onClick={share}
        className="mt-3 flex w-full items-center justify-between border-2 border-ink bg-hotpink px-4 py-3 text-paper transition-transform active:scale-[0.98]"
      >
        <span className="font-display text-xl uppercase">
          {copied ? "Link copied! ✓" : "Share this trip"}
        </span>
        <span aria-hidden>🔗</span>
      </button>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-ink/50">
        Sends a link that rebuilds this exact plan.
      </p>

      <div className="mt-4 border-t-2 border-dashed border-ink/30 pt-3">
        <label className="block font-mono text-[11px] font-bold uppercase tracking-wide">
          Add to your calendar
          <span className="block font-normal normal-case text-ink/50">
            Pick the day you arrive:
          </span>
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="min-h-[44px] border-2 border-ink bg-paper px-2 font-mono text-sm outline-none"
          />
          <button
            type="button"
            onClick={exportIcs}
            className="min-h-[44px] border-2 border-ink bg-sky px-4 font-display text-lg uppercase text-paper transition-transform active:scale-95"
          >
            📅 Download .ics
          </button>
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-ink/50">
          Opens in Apple / Google Calendar. Each day starts at 10 AM.
        </p>
      </div>
    </section>
  );
}
