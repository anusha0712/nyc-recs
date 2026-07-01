import type { Day, DayHours, Place } from "@/data/places";

export const DAYS: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const DAY_LABEL: Record<Day, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

// JS getDay(): 0=Sun..6=Sat  →  our Day keys
const JS_DAY_TO_KEY: Day[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Current wall-clock in America/New_York, regardless of the viewer's timezone. */
export function nowInNY(): { day: Day; minutes: number; label: string } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = get("weekday").toLowerCase().slice(0, 3);
  const day = (JS_DAY_TO_KEY.includes(weekday as Day) ? weekday : "mon") as Day;
  let hour = parseInt(get("hour"), 10);
  if (hour === 24) hour = 0; // some environments emit "24" for midnight
  const minute = parseInt(get("minute"), 10);
  return {
    day,
    minutes: hour * 60 + minute,
    label: `${get("hour")}:${get("minute")}`,
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function prevDay(day: Day): Day {
  const i = DAYS.indexOf(day);
  return DAYS[(i + DAYS.length - 1) % DAYS.length];
}

type OpenState = {
  open: boolean;
  /** Human string like "Open · closes 10 PM" or "Closed · opens Fri 8 AM". */
  label: string;
  /** True when it closes within 60 min. */
  closingSoon: boolean;
};

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/**
 * Is the place open right now (NY time)? Handles past-midnight closes
 * (e.g. open 10:00 → close 04:00) by also checking yesterday's window.
 */
export function isOpenNow(place: Place, now = nowInNY()): OpenState {
  const todayH = place.hours[now.day];
  const yestH = place.hours[prevDay(now.day)];

  // Yesterday's late-night window spilling past midnight into today.
  if (yestH !== "closed") {
    const open = toMinutes(yestH.open);
    let close = toMinutes(yestH.close);
    if (close <= open) {
      // wraps midnight → still open in the early hours of today
      close += 24 * 60;
      if (now.minutes + 24 * 60 < close) {
        const mins = close - (now.minutes + 24 * 60);
        return {
          open: true,
          label: `Open · closes ${fmt12(yestH.close)}`,
          closingSoon: mins <= 60,
        };
      }
    }
  }

  if (todayH === "closed") {
    return { open: false, label: nextOpenLabel(place, now), closingSoon: false };
  }

  const open = toMinutes(todayH.open);
  let close = toMinutes(todayH.close);
  const wraps = close <= open;
  if (wraps) close += 24 * 60;

  if (now.minutes >= open && now.minutes < close) {
    const mins = close - now.minutes;
    return {
      open: true,
      label: `Open · closes ${fmt12(todayH.close)}`,
      closingSoon: mins <= 60,
    };
  }

  return { open: false, label: nextOpenLabel(place, now), closingSoon: false };
}

/** Finds the next day/time the place opens, looking up to a week ahead. */
function nextOpenLabel(place: Place, now: { day: Day; minutes: number }): string {
  const startIdx = DAYS.indexOf(now.day);
  for (let i = 0; i < 8; i++) {
    const day = DAYS[(startIdx + i) % DAYS.length];
    const h = place.hours[day];
    if (h === "closed") continue;
    const open = toMinutes(h.open);
    if (i === 0 && now.minutes < open) {
      return `Closed · opens ${fmt12(h.open)}`;
    }
    if (i > 0) {
      const when = i === 1 ? "tomorrow" : DAY_LABEL[day];
      return `Closed · opens ${when} ${fmt12(h.open)}`;
    }
  }
  return "Hours vary";
}

/** Pretty one-line hours for a given day, e.g. "8 AM – 9 PM" or "Closed". */
export function formatDayHours(h: DayHours): string {
  if (h === "closed") return "Closed";
  return `${fmt12(h.open)} – ${fmt12(h.close)}`;
}
