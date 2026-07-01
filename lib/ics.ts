import { getPlace } from "@/data/places";
import type { Itinerary } from "@/lib/storage";

// The itinerary stores order but no clock times, so on export we lay each day
// out as a friendly schedule: first stop at START_HOUR, each stop lasts its
// suggested time (default 90 min) + a travel gap, then the next begins.
const START_HOUR = 10; // 10:00 local
const DEFAULT_STOP_MIN = 90;
const TRAVEL_GAP_MIN = 30;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Local "floating" time (no timezone suffix) — the right call for a trip plan
// that should read the same wherever the calendar app opens it.
function fmtLocal(d: Date): string {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

type Event = {
  uid: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  description: string;
};

function buildEvents(itinerary: Itinerary, startDate: Date): Event[] {
  const events: Event[] = [];
  itinerary.forEach((day, dayIndex) => {
    let cursor = new Date(startDate);
    cursor.setDate(startDate.getDate() + dayIndex);
    cursor.setHours(START_HOUR, 0, 0, 0);

    day.forEach((placeId, stopIndex) => {
      const place = getPlace(placeId);
      if (!place) return;
      const durationMin = place.suggestedTimeMins ?? DEFAULT_STOP_MIN;
      const start = new Date(cursor);
      const end = new Date(cursor.getTime() + durationMin * 60_000);

      const links = [
        place.website && `Website: ${place.website}`,
        place.menuUrl && `Menu: ${place.menuUrl}`,
        `Map: ${place.googleMapsUrl}`,
      ]
        .filter(Boolean)
        .join("\n");

      events.push({
        uid: `${placeId}-d${dayIndex}-${stopIndex}@dailywaddle`,
        title: `${place.name} (${place.neighborhood})`,
        start,
        end,
        location: `${place.name}, ${place.neighborhood}, New York, NY`,
        description: `${place.authorNote}\n\n${links}`,
      });

      cursor = new Date(end.getTime() + TRAVEL_GAP_MIN * 60_000);
    });
  });
  return events;
}

/** Full .ics document text for the whole trip. */
export function buildIcs(itinerary: Itinerary, startDate: Date): string {
  const events = buildEvents(itinerary, startDate);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Daily Bite//NYC Trip//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:The Daily Bite 🐧 NYC Trip",
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `SUMMARY:${escapeICS(e.title)}`,
      `DTSTART:${fmtLocal(e.start)}`,
      `DTEND:${fmtLocal(e.end)}`,
      `LOCATION:${escapeICS(e.location)}`,
      `DESCRIPTION:${escapeICS(e.description)}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  // ICS wants CRLF line endings.
  return lines.join("\r\n");
}

/** Triggers a download of the .ics in the browser. */
export function downloadIcs(itinerary: Itinerary, startDate: Date): void {
  const text = buildIcs(itinerary, startDate);
  const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "daily-waddle-nyc.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
