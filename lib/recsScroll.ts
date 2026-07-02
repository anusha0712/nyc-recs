import { useEffect, useLayoutEffect } from "react";

// Remembers where you were on /recs so tapping into a place and pressing back
// drops you right back on the card you left from — not the top of the list.
// Session-scoped (clears when the tab closes), namespaced like the rest of the app.
const SCROLL_KEY = "dailywaddle:recsScroll";
const RETURN_KEY = "dailywaddle:recsReturn"; // holds the id of the card you tapped

// useLayoutEffect on the server is a no-op and warns; fall back to useEffect there.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Called from a place card the moment it's tapped: record which card and the
// exact scroll offset, so "back" can restore both.
export function markRecsReturn(placeId: string) {
  try {
    sessionStorage.setItem(RETURN_KEY, placeId);
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  } catch {}
}

// Called continuously while scrolling /recs so the offset is fresh even if the
// user leaves some other way.
export function saveRecsScroll() {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  } catch {}
}

// Consumes the return marker (one-shot): returns the card id + offset to restore,
// or null on a fresh visit. Clears the marker so a later fresh nav starts at top.
export function takeRecsReturn(): { id: string; y: number } | null {
  try {
    const id = sessionStorage.getItem(RETURN_KEY);
    if (!id) return null;
    const y = Number(sessionStorage.getItem(SCROLL_KEY) ?? 0);
    sessionStorage.removeItem(RETURN_KEY);
    return { id, y };
  } catch {
    return null;
  }
}
