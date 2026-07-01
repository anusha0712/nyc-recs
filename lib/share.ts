import { EMPTY_ITINERARY, NUM_DAYS, type Itinerary } from "@/lib/storage";
import { getPlace } from "@/data/places";

// Compact, URL-safe encoding of an itinerary.
// Shape: days joined by "~", place ids within a day joined by ".", then base64url.
// (Place ids are kebab-case slugs, so "." and "~" never collide.)

function toBase64Url(s: string): string {
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(s, "utf8").toString("base64")
      : window.btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  if (typeof window === "undefined") {
    return Buffer.from(b64, "base64").toString("utf8");
  }
  return decodeURIComponent(escape(window.atob(b64)));
}

export function encodeItinerary(itinerary: Itinerary): string {
  return toBase64Url(itinerary.map((day) => day.join(".")).join("~"));
}

/** Decodes a share param, dropping any unknown/removed place ids. Returns null if invalid. */
export function decodeItinerary(param: string): Itinerary | null {
  try {
    const raw = fromBase64Url(param);
    const days = raw.split("~").map((d) => (d ? d.split(".") : []));
    const cleaned: Itinerary = EMPTY_ITINERARY.map((_, i) =>
      (days[i] ?? []).filter((id) => getPlace(id) !== undefined),
    );
    return cleaned;
  } catch {
    return null;
  }
}

export function itineraryIsEmpty(itinerary: Itinerary): boolean {
  return itinerary.every((day) => day.length === 0);
}

export function countPlaces(itinerary: Itinerary): number {
  return itinerary.reduce((n, day) => n + day.length, 0);
}

/** Builds a full shareable URL for the current origin. */
export function buildShareUrl(itinerary: Itinerary, origin: string): string {
  return `${origin}/itinerary?trip=${encodeItinerary(itinerary)}`;
}

export const DEFAULT_DAY_TITLES = Array.from(
  { length: NUM_DAYS },
  (_, i) => `Day ${i + 1}`,
);
