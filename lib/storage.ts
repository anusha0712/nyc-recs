"use client";

import { useCallback, useEffect, useState } from "react";

const PREFIX = "dailywaddle:";

/** Generic localStorage-backed state, SSR-safe (starts from `initial`, hydrates after mount). */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const storageKey = PREFIX + key;
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Read persisted value once after mount (SSR-safe hydration). The setState
    // calls here are intentional client-only initialization.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore malformed / unavailable storage */
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [storageKey]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(resolved));
        } catch {
          /* storage full / blocked — keep in-memory */
        }
        return resolved;
      });
    },
    [storageKey],
  );

  return [value, set, hydrated];
}

// ── Itinerary ────────────────────────────────────────────────────────────────
// 4 days, each an ordered list of place IDs.
export const NUM_DAYS = 4;
export type Itinerary = string[][]; // itinerary[dayIndex] = ordered place ids

export const EMPTY_ITINERARY: Itinerary = Array.from({ length: NUM_DAYS }, () => []);

export function useItinerary() {
  const [itinerary, setItinerary, hydrated] = useLocalStorage<Itinerary>(
    "itinerary",
    EMPTY_ITINERARY,
  );

  const addToDay = useCallback(
    (dayIndex: number, placeId: string) =>
      setItinerary((prev) => {
        const next = prev.map((d) => [...d]);
        // Move if already present elsewhere; no duplicates across the trip.
        for (const day of next) {
          const idx = day.indexOf(placeId);
          if (idx !== -1) day.splice(idx, 1);
        }
        if (!next[dayIndex].includes(placeId)) next[dayIndex].push(placeId);
        return next;
      }),
    [setItinerary],
  );

  const removeFromDay = useCallback(
    (dayIndex: number, placeId: string) =>
      setItinerary((prev) =>
        prev.map((d, i) => (i === dayIndex ? d.filter((id) => id !== placeId) : d)),
      ),
    [setItinerary],
  );

  const setDayOrder = useCallback(
    (dayIndex: number, ordered: string[]) =>
      setItinerary((prev) => prev.map((d, i) => (i === dayIndex ? ordered : d))),
    [setItinerary],
  );

  const dayForPlace = useCallback(
    (placeId: string): number | null => {
      const idx = itinerary.findIndex((d) => d.includes(placeId));
      return idx === -1 ? null : idx;
    },
    [itinerary],
  );

  const clearAll = useCallback(
    () => setItinerary(EMPTY_ITINERARY),
    [setItinerary],
  );

  return {
    itinerary,
    setItinerary,
    addToDay,
    removeFromDay,
    setDayOrder,
    dayForPlace,
    clearAll,
    hydrated,
  };
}

// ── Been-there ───────────────────────────────────────────────────────────────
export function useBeenThere() {
  const [ids, setIds, hydrated] = useLocalStorage<string[]>("beenThere", []);

  const toggle = useCallback(
    (placeId: string) =>
      setIds((prev) =>
        prev.includes(placeId)
          ? prev.filter((id) => id !== placeId)
          : [...prev, placeId],
      ),
    [setIds],
  );

  const has = useCallback((placeId: string) => ids.includes(placeId), [ids]);

  return { beenThere: ids, toggle, has, hydrated };
}
