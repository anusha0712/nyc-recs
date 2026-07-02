"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const PREFIX = "dailywaddle:";

// ─────────────────────────────────────────────────────────────────────────────
// Shared localStorage store.
//
// Every hook instance for a given key subscribes to ONE module-level store, so
// updates from any component (e.g. two different AddToDayButtons) are seen by all
// the others immediately. Previously each hook held its own useState copy, so a
// second write raced on stale state and clobbered the first — adding two spots in
// a row only kept the last one. This fixes that at the source.
// ─────────────────────────────────────────────────────────────────────────────

const listeners = new Map<string, Set<() => void>>();
// Cache the parsed value keyed by its raw string, so getSnapshot returns a
// referentially-stable value when nothing changed (required by useSyncExternalStore).
const cache = new Map<string, { raw: string | null; value: unknown }>();

function subscribersFor(storageKey: string): Set<() => void> {
  let set = listeners.get(storageKey);
  if (!set) {
    set = new Set();
    listeners.set(storageKey, set);
  }
  return set;
}

function readRaw(storageKey: string): string | null {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function getSnapshot<T>(storageKey: string, initial: T): T {
  const raw = readRaw(storageKey);
  const cached = cache.get(storageKey);
  if (cached && cached.raw === raw) return cached.value as T;
  let value: T;
  if (raw == null) {
    value = initial;
  } else {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = initial;
    }
  }
  cache.set(storageKey, { raw, value });
  return value;
}

function writeValue<T>(storageKey: string, next: T) {
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(storageKey, raw);
  } catch {
    /* storage full / blocked — keep in-memory copy so the UI still updates */
  }
  cache.set(storageKey, { raw, value: next });
  subscribersFor(storageKey).forEach((notify) => notify());
}

// Cross-tab sync: when another tab writes, drop our cache for that key and
// notify local subscribers. Registered once, lazily.
let crossTabWired = false;
function ensureCrossTabListener() {
  if (crossTabWired || typeof window === "undefined") return;
  crossTabWired = true;
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    const set = listeners.get(e.key);
    if (!set) return;
    cache.delete(e.key);
    set.forEach((notify) => notify());
  });
}

/** localStorage-backed state, shared across all hook instances for the same key. */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const storageKey = PREFIX + key;

  const subscribe = useCallback(
    (cb: () => void) => {
      const set = subscribersFor(storageKey);
      set.add(cb);
      ensureCrossTabListener();
      return () => {
        set.delete(cb);
      };
    },
    [storageKey],
  );

  const value = useSyncExternalStore<T>(
    subscribe,
    () => getSnapshot(storageKey, initial),
    () => initial, // server render: always the initial value
  );

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getSnapshot(storageKey, initial);
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeValue(storageKey, resolved);
    },
    [storageKey, initial],
  );

  // Mirrors the old hook's `hydrated` flag: false during SSR / first paint, true
  // once mounted on the client. Lets components show a placeholder until then.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return [value, set, hydrated];
}

// ── Itinerary ────────────────────────────────────────────────────────────────
// 5 days (the trip runs Jul 6–10), each an ordered list of place IDs.
export const NUM_DAYS = 5;
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
const EMPTY_BEEN: string[] = [];

export function useBeenThere() {
  const [ids, setIds, hydrated] = useLocalStorage<string[]>("beenThere", EMPTY_BEEN);

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
