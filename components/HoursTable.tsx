"use client";

import { useEffect, useState } from "react";
import { DAYS, DAY_LABEL, formatDayHours, nowInNY } from "@/lib/hours";
import type { Day, Place } from "@/data/places";

// Full week hours; highlights "today" in NY time (client-side to stay correct
// wherever the reader is).
export default function HoursTable({ place }: { place: Place }) {
  const [today, setToday] = useState<Day | null>(null);

  useEffect(() => {
    // Client-only: "today" depends on NY wall-clock, resolved after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(nowInNY().day);
  }, []);

  return (
    <table className="w-full border-collapse font-mono text-sm">
      <tbody>
        {DAYS.map((day) => {
          const isToday = day === today;
          const h = place.hours[day];
          const closed = h === "closed";
          return (
            <tr
              key={day}
              className={`border-b border-dashed border-ink/20 ${
                isToday ? "bg-taxi/60" : ""
              }`}
            >
              <th
                scope="row"
                className="py-1.5 pl-1 text-left font-bold uppercase tracking-wide"
              >
                {DAY_LABEL[day]}
                {isToday && <span className="ml-1 text-[10px] text-hotred">• today</span>}
              </th>
              <td
                className={`py-1.5 pr-1 text-right ${closed ? "text-ink/40" : ""}`}
              >
                {formatDayHours(h)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
