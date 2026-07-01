"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getPlace } from "@/data/places";
import { useItinerary, NUM_DAYS } from "@/lib/storage";
import { decodeItinerary, countPlaces, itineraryIsEmpty } from "@/lib/share";
import SortableStop from "@/components/itinerary/SortableStop";
import ShareExport from "@/components/itinerary/ShareExport";

const DAY_COLORS = ["bg-hotred", "bg-sky", "bg-park", "bg-grape"];

export default function ItineraryBuilder({ sharedParam }: { sharedParam?: string }) {
  const { itinerary, setItinerary, removeFromDay, addToDay, setDayOrder, hydrated } =
    useItinerary();
  const [activeDay, setActiveDay] = useState(0);
  const [dismissedShare, setDismissedShare] = useState(false);

  const sensors = useSensors(
    // Small distance so taps/scrolls still work but drags engage quickly.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const shared = useMemo(
    () => (sharedParam ? decodeItinerary(sharedParam) : null),
    [sharedParam],
  );
  const showShareBanner =
    hydrated && shared && !itineraryIsEmpty(shared) && !dismissedShare;

  const dayIds = itinerary[activeDay] ?? [];

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = dayIds.indexOf(String(active.id));
    const newIndex = dayIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    setDayOrder(activeDay, arrayMove(dayIds, oldIndex, newIndex));
  };

  const dayMinutes = (dayIndex: number) =>
    (itinerary[dayIndex] ?? []).reduce(
      (sum, id) => sum + (getPlace(id)?.suggestedTimeMins ?? 0),
      0,
    );

  if (!hydrated) {
    return (
      <div className="paper mt-4 animate-pulse p-8 text-center font-mono text-sm uppercase tracking-widest text-ink/40">
        Loading your trip…
      </div>
    );
  }

  const total = countPlaces(itinerary);

  return (
    <div>
      {showShareBanner && shared && (
        <div className="paper mb-4 bg-taxi p-3">
          <p className="font-display text-xl uppercase leading-none">
            A trip was shared with you!
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide">
            {countPlaces(shared)} stops across {NUM_DAYS} days.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setItinerary(shared);
                setDismissedShare(true);
              }}
              className="border-2 border-ink bg-park px-3 py-1.5 font-mono text-xs font-bold uppercase text-paper active:scale-95"
            >
              Load this trip
            </button>
            <button
              type="button"
              onClick={() => setDismissedShare(true)}
              className="border-2 border-ink bg-paper px-3 py-1.5 font-mono text-xs font-bold uppercase active:scale-95"
            >
              Keep mine
            </button>
          </div>
        </div>
      )}

      {/* Day tabs */}
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: NUM_DAYS }, (_, i) => {
          const count = (itinerary[i] ?? []).length;
          const active = i === activeDay;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActiveDay(i)}
              aria-pressed={active}
              className={`border-2 border-ink px-1 py-2 text-center transition-transform active:scale-95 ${
                active ? `${DAY_COLORS[i]} text-paper shadow-[3px_3px_0_0_#141210]` : "bg-paper"
              }`}
            >
              <span className="block font-display text-2xl leading-none">D{i + 1}</span>
              <span className="block font-mono text-[10px] uppercase tracking-wide">
                {count} {count === 1 ? "stop" : "stops"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active day header */}
      <div className="mt-4 flex items-end justify-between">
        <h2 className="font-display text-3xl uppercase leading-none">Day {activeDay + 1}</h2>
        {dayMinutes(activeDay) > 0 && (
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink/60">
            ~{Math.round((dayMinutes(activeDay) / 60) * 10) / 10} hrs of stops
          </p>
        )}
      </div>

      {/* Stops */}
      {dayIds.length === 0 ? (
        <div className="paper mt-3 p-6 text-center">
          <p className="font-display text-2xl uppercase">Nothing here yet</p>
          <p className="mt-1 font-serif italic text-ink/70">
            Add spots from the recs and they’ll land here. 🐧
          </p>
          <Link
            href="/recs"
            className="mt-3 inline-block border-2 border-ink bg-taxi px-4 py-2 font-mono text-sm font-bold uppercase active:scale-95"
          >
            Browse the recs →
          </Link>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dayIds} strategy={verticalListSortingStrategy}>
            <ul className="mt-3 grid gap-2.5">
              {dayIds.map((id, index) => {
                const place = getPlace(id);
                if (!place) return null;
                return (
                  <SortableStop
                    key={id}
                    place={place}
                    index={index}
                    dayIndex={activeDay}
                    numDays={NUM_DAYS}
                    onRemove={() => removeFromDay(activeDay, id)}
                    onMove={(toDay) => addToDay(toDay, id)}
                  />
                );
              })}
            </ul>
          </SortableContext>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-ink/40">
            Drag ⋮⋮ to reorder · use the dropdown to move days
          </p>
        </DndContext>
      )}

      {/* Add more */}
      <Link
        href="/recs"
        className="mt-4 flex items-center justify-center border-2 border-dashed border-ink/50 py-3 font-mono text-sm font-bold uppercase tracking-wide text-ink/60 transition-colors hover:bg-paper"
      >
        ＋ Add more spots
      </Link>

      {total > 0 && <ShareExport itinerary={itinerary} />}
    </div>
  );
}
