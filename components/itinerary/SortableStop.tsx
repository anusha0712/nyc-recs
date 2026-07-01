"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CATEGORY_META, type Place } from "@/data/places";
import PenguinRating from "@/components/PenguinRating";
import OpenNowBadge from "@/components/OpenNowBadge";

// One draggable stop within a day. The whole card is the drag handle (nice on
// touch); the "open" link and controls stop propagation so taps still work.
export default function SortableStop({
  place,
  index,
  onRemove,
  onMove,
  numDays,
  dayIndex,
}: {
  place: Place;
  index: number;
  onRemove: () => void;
  onMove: (toDay: number) => void;
  numDays: number;
  dayIndex: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: place.id });
  const meta = CATEGORY_META[place.category];

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`paper flex items-stretch gap-2 p-2 ${
        isDragging ? "z-10 opacity-90 shadow-[6px_6px_0_0_#141210]" : ""
      }`}
    >
      {/* drag handle */}
      <button
        type="button"
        className="flex cursor-grab touch-none items-center px-1 text-ink/40 active:cursor-grabbing"
        aria-label={`Reorder ${place.name}`}
        {...attributes}
        {...listeners}
      >
        <span className="text-xl leading-none">⋮⋮</span>
      </button>

      {/* order number */}
      <div className="flex w-7 shrink-0 items-center justify-center border-2 border-ink bg-taxi font-display text-lg">
        {index + 1}
      </div>

      {/* body */}
      <div className="min-w-0 flex-1">
        <Link href={`/place/${place.id}`} className="block">
          <p className="truncate font-display text-lg uppercase leading-none">{place.name}</p>
          <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wide text-ink/60">
            {meta.emoji} {place.neighborhood}
            {place.suggestedTimeMins ? ` · ~${place.suggestedTimeMins}m` : ""}
          </p>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <PenguinRating rating={place.penguinRating} />
          <OpenNowBadge place={place} />
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-col items-end justify-between gap-1">
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${place.name} from this day`}
          className="border-2 border-hotred px-1.5 font-mono text-[11px] font-bold text-hotred transition-transform active:scale-90"
        >
          ✕
        </button>
        {numDays > 1 && (
          <label className="inline-flex">
            <span className="sr-only">Move {place.name} to another day</span>
            <select
              value={dayIndex}
              onChange={(e) => onMove(Number(e.target.value))}
              className="border-2 border-ink bg-cream px-1 py-0.5 font-mono text-[10px] font-bold uppercase outline-none"
            >
              {Array.from({ length: numDays }, (_, i) => (
                <option key={i} value={i}>
                  Day {i + 1}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </li>
  );
}
