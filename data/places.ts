// ─────────────────────────────────────────────────────────────────────────────
// THE DAILY WADDLE — place data (single source of truth)
//
// To add a place: append a `Place` to PLACES below. `id` must be unique + stable
// (it's baked into localStorage + share URLs). Fill all 7 `hours` days. `coords`
// power the map. Keep `authorNote` in the author's real voice.
//
// Hours are hand-curated best-effort snapshots (NY time) — always double-check
// via each place's Google Maps link before you go.
// ─────────────────────────────────────────────────────────────────────────────

import curationData from "./curation.json";

export type Category =
  | "food"
  | "sweets"
  | "coffee"
  | "drinks"
  | "sight"
  | "museum"
  | "shopping"
  | "park";

export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type DayHours = { open: string; close: string } | "closed"; // 24h "HH:MM", NY time

export type Place = {
  id: string;
  name: string;
  neighborhood: string;
  category: Category;
  cuisine?: string;
  tags: string[];
  priceLevel: 1 | 2 | 3 | 4;
  penguinRating?: number; // deprecated — no longer displayed
  isFav?: boolean; // Anusha's priority pick (shows a FAV badge + filter)
  coords: { lat: number; lng: number };
  hours: Record<Day, DayHours>;
  suggestedTimeMins?: number;
  reservationNeeded?: boolean;
  reservationUrl?: string; // Resy / OpenTable / SevenRooms booking link
  website?: string;
  menuUrl?: string;
  googleMapsUrl: string;
  photo?: string;
  authorNote: string;
};

export const CATEGORY_META: Record<
  Category,
  { label: string; emoji: string; color: string }
> = {
  food: { label: "Eats", emoji: "🍽️", color: "hotred" },
  sweets: { label: "Misc", emoji: "🍰", color: "taxi" },
  coffee: { label: "Beverages", emoji: "☕️", color: "grape" },
  drinks: { label: "Drinks", emoji: "🍸", color: "hotpink" },
  sight: { label: "Sights", emoji: "🗽", color: "sky" },
  museum: { label: "Museums", emoji: "🖼️", color: "grape" },
  shopping: { label: "Shops", emoji: "🛍️", color: "park" },
  park: { label: "Parks", emoji: "🌳", color: "park" },
};

// Build a Google Maps search link that always resolves to the live listing
// (and thus live hours) regardless of our stored coords.
function gmaps(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query + " New York",
  )}`;
}

// Parse "HH:MM-HH:MM" (or "closed") into a DayHours. Keeps the data terse.
function h(spec: string): DayHours {
  if (spec === "closed") return "closed";
  const [open, close] = spec.split("-");
  return { open, close };
}

// Build a 7-day hours record from a `mon,tue,...` spec map. Missing days closed.
function hours(spec: Partial<Record<Day, string>>): Record<Day, DayHours> {
  const days: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  return days.reduce(
    (acc, d) => {
      acc[d] = h(spec[d] ?? "closed");
      return acc;
    },
    {} as Record<Day, DayHours>,
  );
}

// A whole week on one schedule, with optional per-day overrides.
function everyday(
  spec: string,
  overrides: Partial<Record<Day, string>> = {},
): Record<Day, DayHours> {
  const days: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  return days.reduce(
    (acc, d) => {
      acc[d] = h(overrides[d] ?? spec);
      return acc;
    },
    {} as Record<Day, DayHours>,
  );
}

const RAW_PLACES: Place[] = [
  // ── FOOD ───────────────────────────────────────────────────────────────────
  {
    id: "rowdy-rooster",
    name: "Rowdy Rooster",
    neighborhood: "East Village",
    category: "food",
    cuisine: "Indian fried chicken",
    tags: ["spicy", "quick", "walk-in", "late night"],
    priceLevel: 2,
    penguinRating: 5,
    coords: { lat: 40.7276, lng: -73.9856 },
    hours: everyday("11:00-23:00", { thu: "11:00-01:00", fri: "11:00-01:00", sat: "11:00-01:00" }),
    suggestedTimeMins: 30,
    reservationNeeded: false,
    website: "https://www.rowdyrooster.com/",
    googleMapsUrl: gmaps("Rowdy Rooster East Village"),
    authorNote:
      "Gloriously crispy Indian fried chicken on fluffy pao, with heat levels that escalate FAST. Get the Rowdy if you're brave, but honestly the mid-tier is plenty. Order at the counter, eat it hot. 🐧🔥",
  },
  {
    id: "semma",
    name: "Semma",
    neighborhood: "West Village",
    category: "food",
    cuisine: "South Indian",
    tags: ["michelin", "reservation", "date night", "vegetarian-friendly"],
    priceLevel: 4,
    penguinRating: 5,
    coords: { lat: 40.736, lng: -74.0005 },
    hours: hours({ mon: "17:00-22:00", tue: "17:00-22:00", wed: "17:00-22:00", thu: "17:00-22:00", fri: "17:00-22:00", sat: "17:00-22:00" }),
    suggestedTimeMins: 120,
    reservationNeeded: true,
    website: "https://www.semma.nyc/",
    menuUrl: "https://www.semma.nyc/",
    googleMapsUrl: gmaps("Semma West Village"),
    authorNote:
      "Michelin-starred Tamil Nadu cooking — the gunpowder dosa is unreal. This is one of the hardest tables in the city, so set an alarm for the reservation drop (~15 days out). Worth every bit of the scramble.",
  },
  {
    id: "bhatti-indian-grill",
    name: "Bhatti Indian Grill",
    neighborhood: "Murray Hill",
    category: "food",
    cuisine: "North Indian",
    tags: ["spicy", "group-friendly", "vegetarian-friendly", "byob"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.7431, lng: -73.9829 },
    hours: everyday("12:00-22:30"),
    suggestedTimeMins: 90,
    reservationNeeded: false,
    website: "https://www.bhattinyc.com/",
    menuUrl: "https://www.bhattinyc.com/menu",
    googleMapsUrl: gmaps("Bhatti Indian Grill Murray Hill"),
    authorNote:
      "Curry Hill BYOB — bring a bottle! Smoky tandoor everything; the galouti kebab melts and the lamb chops are the move. Great affordable group dinner.",
  },
  {
    id: "mala-project",
    name: "Mala Project",
    neighborhood: "East Village",
    category: "food",
    cuisine: "Sichuan dry pot",
    tags: ["spicy", "walk-in", "vegetarian-friendly", "group-friendly"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.7274, lng: -73.9855 },
    hours: everyday("12:00-21:15", { fri: "12:00-22:00", sat: "11:00-22:00", sun: "11:00-21:15" }),
    suggestedTimeMins: 75,
    reservationNeeded: false,
    website: "https://www.malaproject.com/",
    menuUrl: "https://www.malaproject.com/",
    googleMapsUrl: gmaps("Mala Project East Village"),
    authorNote:
      "You build your own dry pot from a checklist of meats + veg, then they wok-toss it in numbing-spicy málà sauce. So fun to share, and a dream for veggie-lovers. Pick medium spice unless you know what you're doing.",
  },
  {
    id: "au-zaatar",
    name: "Au Za'atar",
    neighborhood: "East Village",
    category: "food",
    cuisine: "Lebanese",
    tags: ["reservation", "group-friendly", "date night", "vegetarian-friendly"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.7297, lng: -73.9797 },
    hours: everyday("11:00-23:00"),
    suggestedTimeMins: 90,
    reservationNeeded: true,
    website: "https://www.auzaatar.com/location/au-zaatar-east-village/",
    menuUrl: "https://www.auzaatar.com/order-online/",
    googleMapsUrl: gmaps("Au Zaatar East Village"),
    authorNote:
      "Get the tableside shawarma — they carve it right at your table and it's a whole moment. Lush, plant-draped room. Book ahead, especially for a group.",
  },
  {
    id: "little-rubys",
    name: "Little Ruby's",
    neighborhood: "Nolita",
    category: "food",
    cuisine: "Australian café",
    tags: ["brunch", "walk-in", "quick", "group-friendly"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.7223, lng: -73.9959 },
    hours: everyday("09:00-23:00"),
    suggestedTimeMins: 60,
    reservationNeeded: false,
    website: "https://www.rubyscafe.com/location/soho/",
    googleMapsUrl: gmaps("Little Ruby's Cafe Nolita"),
    authorNote:
      "Sunny all-day Aussie café — the Bronte burger and the big avo brunch plates are the classics. Walk-in, first-come on weekends, so go a little off-peak.",
  },
  {
    id: "theodora",
    name: "Theodora",
    neighborhood: "Fort Greene",
    category: "food",
    cuisine: "Mediterranean",
    tags: ["reservation", "date night", "wine bar", "michelin"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.6861, lng: -73.9731 },
    hours: everyday("17:00-22:00"),
    suggestedTimeMins: 105,
    reservationNeeded: true,
    website: "https://www.theodoranyc.com/",
    menuUrl: "https://www.theodoranyc.com/menu2",
    googleMapsUrl: gmaps("Theodora Fort Greene Brooklyn"),
    authorNote:
      "Fire-and-smoke Levantine cooking in a cozy Fort Greene room — the dry-aged whole fish is the splurge, and the natural wine list is lovely. A proper date-night dinner.",
  },
  {
    id: "oxomoco",
    name: "Oxomoco",
    neighborhood: "Greenpoint",
    category: "food",
    cuisine: "Mexican",
    tags: ["michelin", "reservation", "outdoor", "date night"],
    priceLevel: 3,
    penguinRating: 5,
    coords: { lat: 40.7299, lng: -73.9555 },
    hours: everyday("12:00-22:00", { sat: "11:00-22:00", sun: "11:00-22:00" }),
    suggestedTimeMins: 105,
    reservationNeeded: true,
    website: "https://www.oxomoconyc.com/",
    googleMapsUrl: gmaps("Oxomoco Greenpoint Brooklyn"),
    authorNote:
      "Michelin-starred wood-fired Mexican with house-milled heirloom-corn tortillas in a sunny, plant-filled space. Sit outside if you can and get a bunch of tacos to share. (Note: closes ~3–5pm between lunch & dinner — check the maps link.)",
  },
  {
    id: "ci-siamo",
    name: "Ci Siamo",
    neighborhood: "Manhattan West",
    category: "food",
    cuisine: "Italian",
    tags: ["reservation", "date night", "the onion tart", "group-friendly"],
    priceLevel: 3,
    penguinRating: 5,
    coords: { lat: 40.7529, lng: -73.9993 },
    hours: everyday("11:30-22:00"),
    suggestedTimeMins: 120,
    reservationNeeded: true,
    website: "https://www.cisiamo.com/",
    menuUrl: "https://www.cisiamo.com/menus/",
    googleMapsUrl: gmaps("Ci Siamo Manhattan West"),
    authorNote:
      "THE ONION TART. Danny Meyer + Hillary Sterling's live-fire Italian, and that molten caramelized cipollini tart with goat-cheese fondue is the whole reason we're here. Order it. Then order it again.",
  },
  {
    id: "la-esquina",
    name: "La Esquina",
    neighborhood: "Nolita",
    category: "food",
    cuisine: "Mexican",
    tags: ["hidden gem", "late night", "reservation", "dancing"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7212, lng: -73.9962 },
    hours: everyday("18:00-00:00", { thu: "18:00-02:00", fri: "18:00-02:00", sat: "18:00-02:00" }),
    suggestedTimeMins: 105,
    reservationNeeded: true,
    website: "https://www.esquinanyc.com/location/la-esquina-nyc-downtown/",
    googleMapsUrl: gmaps("La Esquina Nolita"),
    authorNote:
      "The trick: walk through the little taqueria, past the kitchen, and down the hidden stairs into a candlelit brick-cellar brasserie. Margaritas, mariachi energy, runs late. Book the downstairs.",
  },
  {
    id: "softside",
    name: "Softside",
    neighborhood: "Nolita",
    category: "food",
    cuisine: "Soft serve",
    tags: ["sweet tooth", "grab & go", "quick"],
    priceLevel: 1,
    penguinRating: 4,
    coords: { lat: 40.7222, lng: -73.9962 },
    hours: everyday("12:00-23:00", { fri: "12:00-02:00", sat: "12:00-02:00" }),
    suggestedTimeMins: 20,
    reservationNeeded: false,
    website: "https://www.instagram.com/softside/",
    googleMapsUrl: gmaps("Softside soft serve Nolita"),
    authorNote:
      "The one to get: vanilla soft serve with olive oil, honey, and flaky sea salt. Sounds weird, tastes incredible. Tiny walk-up window — perfect post-dinner wander treat. 🍦",
  },
  {
    id: "apollo-bagels",
    name: "Apollo Bagels",
    neighborhood: "East Village",
    category: "food",
    cuisine: "Bagels",
    tags: ["long lines", "iconic", "grab & go", "morning"],
    priceLevel: 2,
    penguinRating: 5,
    coords: { lat: 40.7288, lng: -73.9848 },
    hours: everyday("07:00-17:00"),
    suggestedTimeMins: 30,
    reservationNeeded: false,
    website: "https://apollobagels.com/",
    googleMapsUrl: gmaps("Apollo Bagels East Village"),
    authorNote:
      "Cult hand-rolled, wood-fired bagels — the cream cheese is the star. Real talk: the line is long and they SELL OUT, so go early-ish. Worth it once. 🐧",
  },

  {
    id: "lilia",
    name: "Lilia",
    neighborhood: "Williamsburg",
    category: "food",
    cuisine: "Italian",
    tags: ["reservation", "date night", "iconic", "pasta"],
    priceLevel: 3,
    penguinRating: 5,
    coords: { lat: 40.7185, lng: -73.9509 },
    hours: everyday("17:00-22:00", { fri: "16:00-22:00", sat: "16:00-22:00", sun: "16:00-22:00" }),
    suggestedTimeMins: 120,
    reservationNeeded: true,
    website: "https://www.lilianewyork.com/",
    menuUrl: "https://www.lilianewyork.com/menu/dinner/",
    googleMapsUrl: gmaps("Lilia Williamsburg Brooklyn"),
    authorNote:
      "Missy Robbins' handmade pastas are a religion — the mafaldini with pink peppercorn is THE dish. One of the toughest Resy scrambles in the city, so book the exact second the window opens. Dreamy special-occasion dinner.",
  },
  {
    id: "jeffreys-grocery",
    name: "Jeffrey's Grocery",
    neighborhood: "West Village",
    category: "food",
    cuisine: "Seafood",
    tags: ["oysters", "reservation", "date night", "outdoor"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7339, lng: -74.0006 },
    hours: hours({ mon: "11:30-22:00", tue: "11:30-23:00", wed: "11:30-23:00", thu: "11:30-23:00", fri: "11:30-23:00", sat: "10:00-23:00", sun: "10:00-22:00" }),
    suggestedTimeMins: 90,
    reservationNeeded: true,
    website: "https://www.jeffreysgrocery.com/",
    googleMapsUrl: gmaps("Jeffrey's Grocery West Village"),
    authorNote:
      "Sunny corner seafood spot — perch at the raw bar with a tower of oysters and a glass of white, then spill onto the sidewalk tables. Great for a leisurely West Village afternoon.",
  },

  // ── PIZZA ────────────────────────────────────────────────────────────────
  {
    id: "lindustrie-pizzeria",
    name: "L'Industrie Pizzeria",
    neighborhood: "Williamsburg",
    category: "food",
    cuisine: "Pizza",
    tags: ["walk-in", "quick", "iconic", "cheap eats"],
    priceLevel: 1,
    penguinRating: 5,
    coords: { lat: 40.7118, lng: -73.9575 },
    hours: everyday("12:00-22:00"),
    suggestedTimeMins: 30,
    reservationNeeded: false,
    website: "https://www.lindustriebk.com/",
    menuUrl: "https://www.lindustriebk.com/hours-and-location",
    googleMapsUrl: gmaps("L'Industrie Pizzeria Williamsburg"),
    authorNote:
      "Thin, floppy, perfect NY slices — the burrata slice is the famous one. There's basically always a sidewalk line but it moves fast. Cash or card. Non-negotiable stop.",
  },
  {
    id: "emmetts-on-grove",
    name: "Emmett's on Grove",
    neighborhood: "West Village",
    category: "food",
    cuisine: "Pizza",
    tags: ["late night", "reservation", "group-friendly"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.7331, lng: -74.002 },
    hours: hours({ tue: "17:00-00:00", wed: "17:00-00:00", thu: "17:00-01:00", fri: "17:00-01:00", sat: "16:00-01:00", sun: "16:00-23:00" }),
    suggestedTimeMins: 90,
    reservationNeeded: true,
    website: "https://www.emmettsongrove.com/",
    menuUrl: "https://www.emmettsongrove.com/menus/",
    googleMapsUrl: gmaps("Emmett's on Grove West Village"),
    authorNote:
      "Chicago tavern-style thin-crust (and deep-dish) in a cozy Midwest supper-club room. Grab a Resy — it fills up, and it's a great late one. Closed Mondays.",
  },
  {
    id: "lucali",
    name: "Lucali",
    neighborhood: "Carroll Gardens",
    category: "food",
    cuisine: "Pizza",
    tags: ["walk-in", "cash only", "iconic", "byob"],
    priceLevel: 2,
    penguinRating: 5,
    coords: { lat: 40.6796, lng: -73.9999 },
    hours: everyday("17:00-23:00", { tue: "closed" }),
    suggestedTimeMins: 120,
    reservationNeeded: false,
    website: "https://www.lucali.com/",
    googleMapsUrl: gmaps("Lucali Carroll Gardens Brooklyn"),
    authorNote:
      "One of the best pies in the city, and a whole ritual: cash only, BYOB, no phone reservations. Put your name in when the line forms around 5pm, then go grab wine and wait. The wait IS the plan. Closed Tuesdays.",
  },

  // ── DRINKS / BARS ─────────────────────────────────────────────────────────
  {
    id: "verlaine",
    name: "Verlaine",
    neighborhood: "Lower East Side",
    category: "drinks",
    cuisine: "Cocktail bar",
    tags: ["happy hour", "walk-in", "date night", "iconic"],
    priceLevel: 2,
    penguinRating: 5,
    coords: { lat: 40.7189, lng: -73.9873 },
    hours: hours({ tue: "17:00-00:00", wed: "17:00-00:00", thu: "17:00-01:00", fri: "17:00-02:00", sat: "17:00-02:00", sun: "17:00-23:00" }),
    suggestedTimeMins: 75,
    reservationNeeded: false,
    website: "https://www.verlainenyc.com/",
    googleMapsUrl: gmaps("Verlaine Lower East Side"),
    authorNote:
      "The cheap lychee martini happy hour is the stuff of legend and runs late (usually till 10pm!). Dim, red-lit, romantic. Start a night here. Closed Mondays.",
  },
  {
    id: "double-chicken-please",
    name: "Double Chicken Please",
    neighborhood: "Lower East Side",
    category: "drinks",
    cuisine: "Cocktail bar",
    tags: ["reservation", "iconic", "date night", "world's best"],
    priceLevel: 3,
    penguinRating: 5,
    coords: { lat: 40.7188, lng: -73.9899 },
    hours: hours({ tue: "17:00-01:00", wed: "17:00-01:00", thu: "17:00-01:00", fri: "17:00-01:30", sat: "17:00-01:30", sun: "17:00-00:00" }),
    suggestedTimeMins: 90,
    reservationNeeded: true,
    website: "https://doublechickenplease.com/",
    googleMapsUrl: gmaps("Double Chicken Please Lower East Side"),
    authorNote:
      "World's-50-Best famous. The front bar is walk-in; the back room (The Coop) is reservation-only and does those wild cocktails that taste like dishes — Key Lime Pie, Mango Sticky Rice. Book the back if you can. Closed Mondays.",
  },
  {
    id: "saaqi",
    name: "Saaqi",
    neighborhood: "Tribeca",
    category: "drinks",
    cuisine: "Cocktail bar",
    tags: ["date night", "hidden gem", "late night"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7166, lng: -74.0068 },
    hours: hours({ mon: "17:00-22:00", tue: "17:00-22:00", wed: "17:00-22:00", thu: "17:00-22:00", fri: "17:00-00:00", sat: "17:00-00:00", sun: "17:00-22:00" }),
    suggestedTimeMins: 90,
    reservationNeeded: false,
    website: "https://www.musaaferrestaurants.com/saaqi-nyc",
    googleMapsUrl: gmaps("Saaqi cocktail bar Tribeca Musaafer"),
    authorNote:
      "A moody little speakeasy tucked beneath the Indian fine-dining spot Musaafer — South-Asian-inspired cocktails, a story in every glass. Check in at the Musaafer host stand and head down. (Double-check hours — it's newer.)",
  },
  {
    id: "schmuck",
    name: "Schmuck",
    neighborhood: "East Village",
    category: "drinks",
    cuisine: "Cocktail bar",
    tags: ["late night", "walk-in", "hidden gem"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7256, lng: -73.9855 },
    hours: hours({ tue: "16:00-01:00", wed: "16:00-01:00", thu: "16:00-01:00", fri: "16:00-01:00", sat: "16:00-01:00" }),
    suggestedTimeMins: 75,
    reservationNeeded: false,
    website: "https://www.schmucknyc.com/",
    googleMapsUrl: gmaps("Schmuck bar Lower East Side"),
    authorNote:
      "Tiny, walk-in-only, house-party energy — great cocktails and a late-night crowd. Get there before it fills. Closed Sun/Mon.",
  },
  {
    id: "dear-irving-on-hudson",
    name: "Dear Irving on Hudson",
    neighborhood: "Hell's Kitchen",
    category: "drinks",
    cuisine: "Rooftop bar",
    tags: ["rooftop", "views", "reservation", "date night"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7562, lng: -73.9917 },
    hours: hours({ mon: "17:00-00:00", tue: "17:00-00:00", wed: "17:00-01:00", thu: "17:00-01:00", fri: "16:00-02:00", sat: "16:00-02:00", sun: "16:00-00:00" }),
    suggestedTimeMins: 90,
    reservationNeeded: true,
    website: "https://www.dearirving.com/dear-irving-on-hudson",
    googleMapsUrl: gmaps("Dear Irving on Hudson Aliz Hotel"),
    authorNote:
      "Way up on the 40th/41st floors of the Aliz Hotel — polished cocktails with huge skyline + Hudson views. Book a table, go near sunset, thank me later. ✨",
  },
  {
    id: "broken-shaker",
    name: "Broken Shaker",
    neighborhood: "Gramercy",
    category: "drinks",
    cuisine: "Rooftop bar",
    tags: ["rooftop", "views", "outdoor", "group-friendly"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7398, lng: -73.984 },
    hours: everyday("17:00-00:00", { fri: "17:00-01:00", sat: "17:00-01:00" }),
    suggestedTimeMins: 90,
    reservationNeeded: false,
    website: "https://www.brokenshaker.com/location/new-york-hours-and-location/",
    googleMapsUrl: gmaps("Broken Shaker Freehand Hotel New York"),
    authorNote:
      "Lush, plant-filled rooftop on the Freehand Hotel with award-winning, herby cocktails. Easygoing and great for a group. Go before it gets crowded.",
  },
  {
    id: "westlight",
    name: "Westlight",
    neighborhood: "Williamsburg",
    category: "drinks",
    cuisine: "Rooftop bar",
    tags: ["rooftop", "views", "outdoor", "date night"],
    priceLevel: 3,
    penguinRating: 5,
    coords: { lat: 40.722, lng: -73.9575 },
    hours: everyday("16:00-00:00", { fri: "16:00-02:00", sat: "12:00-02:00", sun: "12:00-00:00" }),
    suggestedTimeMins: 90,
    reservationNeeded: false,
    website: "https://www.westlightnyc.com/",
    googleMapsUrl: gmaps("Westlight William Vale Williamsburg"),
    authorNote:
      "22nd-floor wraparound terrace at The William Vale with a 360° Manhattan skyline view — arguably the best rooftop view in the city. Fancy little cocktails. Sunset here is a core memory.",
  },
  {
    id: "le-dive",
    name: "Le Dive",
    neighborhood: "Lower East Side",
    category: "drinks",
    cuisine: "Wine bar",
    tags: ["wine bar", "outdoor", "late night", "walk-in"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7148, lng: -73.9909 },
    hours: hours({ mon: "15:00-00:00", tue: "15:00-01:00", wed: "15:00-01:00", thu: "15:00-02:00", fri: "14:00-02:00", sat: "12:00-02:00", sun: "12:00-00:00" }),
    suggestedTimeMins: 75,
    reservationNeeded: false,
    website: "https://www.ledivenyc.com/",
    googleMapsUrl: gmaps("Le Dive Dimes Square Lower East Side"),
    authorNote:
      "French-tabac natural wine bar at the heart of Dimes Square — the whole scene spills onto the sidewalk. Grab a glass, stand outside, people-watch. Peak downtown summer.",
  },
  {
    id: "parcelle",
    name: "Parcelle",
    neighborhood: "Chinatown",
    category: "drinks",
    cuisine: "Wine bar",
    tags: ["wine bar", "date night", "walk-in", "hidden gem"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7141, lng: -73.9905 },
    hours: hours({ tue: "17:00-22:00", wed: "17:00-22:00", thu: "17:00-00:00", fri: "17:00-00:00", sat: "17:00-00:00", sun: "15:00-21:30" }),
    suggestedTimeMins: 75,
    reservationNeeded: false,
    website: "https://parcellewine.com/pages/wine-bars",
    googleMapsUrl: gmaps("Parcelle wine bar Chinatown Division Street"),
    authorNote:
      "Intimate Division Street wine bar from a beloved shop — pull a bottle off the shelf or settle in for snacks and low-intervention pours. Lovely and low-key. Closed Mondays.",
  },
  {
    id: "sauced",
    name: "Sauced",
    neighborhood: "East Village",
    category: "drinks",
    cuisine: "Natural wine bar",
    tags: ["wine bar", "no menu", "date night", "late night"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.7256, lng: -73.9897 },
    hours: hours({ mon: "17:00-00:00", tue: "17:00-00:00", wed: "17:00-00:00", thu: "17:00-01:00", fri: "17:00-02:00", sat: "15:00-02:00", sun: "15:00-00:00" }),
    suggestedTimeMins: 75,
    reservationNeeded: false,
    website: "https://www.saucedbklyn.com/",
    googleMapsUrl: gmaps("Sauced wine bar East Village 2nd Ave"),
    authorNote:
      "No menu — the server just asks your mood and what you like, then pours you something perfect. Easy, cozy natural-wine hang that started in Williamsburg. Let them surprise you. 🍷",
  },
  {
    id: "bar-pisellino",
    name: "Bar Pisellino",
    neighborhood: "West Village",
    category: "drinks",
    cuisine: "Italian aperitivo",
    tags: ["walk-in", "outdoor", "date night", "aperitivo"],
    priceLevel: 3,
    penguinRating: 4,
    coords: { lat: 40.7335, lng: -74.0027 },
    hours: everyday("08:00-23:00"),
    suggestedTimeMins: 60,
    reservationNeeded: false,
    website: "https://barpisellino.com/",
    googleMapsUrl: gmaps("Bar Pisellino West Village"),
    authorNote:
      "Jewel-box Italian aperitivo spot across from Via Carota — a Negroni Sbagliato at the marble counter and a snack while you watch the West Village go by. Classic golden-hour move.",
  },
  {
    id: "solas",
    name: "Solas",
    neighborhood: "East Village",
    category: "drinks",
    cuisine: "Dance bar",
    tags: ["dancing", "late night", "walk-in", "group-friendly"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.729, lng: -73.9855 },
    hours: hours({ tue: "16:00-02:00", wed: "16:00-02:00", thu: "16:00-02:00", fri: "16:00-04:00", sat: "16:00-04:00", sun: "16:00-02:00" }),
    suggestedTimeMins: 120,
    reservationNeeded: false,
    website: "https://www.solasbar.com/",
    googleMapsUrl: gmaps("Solas bar East Village"),
    authorNote:
      "Two-level East Village spot where the upstairs turns into a dark little dance floor with a DJ till late. Good rowdy-night energy. Closed Mondays.",
  },
  {
    id: "bleecker-street-bar",
    name: "Bleecker Street Bar",
    neighborhood: "NoHo",
    category: "drinks",
    cuisine: "Dive / sports bar",
    tags: ["sports bar", "late night", "walk-in", "happy hour"],
    priceLevel: 1,
    penguinRating: 3,
    coords: { lat: 40.7258, lng: -73.995 },
    hours: everyday("12:00-02:00", { thu: "12:00-04:00", fri: "12:00-04:00", sat: "11:00-04:00" }),
    suggestedTimeMins: 90,
    reservationNeeded: false,
    website: "https://bleeckerstreetbarnyc.com/",
    googleMapsUrl: gmaps("Bleecker Street Bar NoHo"),
    authorNote:
      "No-frills old-school dive with pool tables, cheap pitchers, and the game on every TV. Exactly what you want when you want a sports bar and nothing fancy.",
  },
  {
    id: "bobbys-night-out",
    name: "Bobby's Night Out",
    neighborhood: "East Village",
    category: "drinks",
    cuisine: "Bar & grill",
    tags: ["dancing", "late night", "sports bar", "happy hour"],
    priceLevel: 2,
    penguinRating: 3,
    coords: { lat: 40.7237, lng: -73.9773 },
    hours: hours({ mon: "14:00-00:00", tue: "14:00-00:00", wed: "14:00-00:00", thu: "14:00-02:00", fri: "12:30-04:00", sat: "12:00-04:00", sun: "12:00-00:00" }),
    suggestedTimeMins: 120,
    reservationNeeded: false,
    website: "https://www.bobbysnightout.com/",
    googleMapsUrl: gmaps("Bobby's Night Out Alphabet City East Village"),
    authorNote:
      "Heads up: I couldn't confirm a spot called 'Bobby G's' — this is my best guess (Bobby's Night Out in Alphabet City): sports by day, 90s hip-hop/R&B dance floor by night. Tell me if you meant somewhere else and I'll swap it!",
  },

  // ── COFFEE / CAFÉ ───────────────────────────────────────────────────────────
  {
    id: "cafe-leon-dore",
    name: "Café Leon Dore",
    neighborhood: "Nolita",
    category: "coffee",
    cuisine: "Café",
    tags: ["matcha", "iconic", "walk-in", "people-watching"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.7223, lng: -73.9958 },
    hours: everyday("09:00-19:00", { sun: "09:00-18:00" }),
    suggestedTimeMins: 40,
    reservationNeeded: false,
    website: "https://www.aimeleondore.com/pages/cafe-leon-dore",
    googleMapsUrl: gmaps("Cafe Leon Dore Mulberry Street Nolita"),
    authorNote:
      "Attached to the Aimé Leon Dore flagship — a proper see-and-be-seen scene. Get a matcha or a Greek-style freddo espresso and do some serious streetwear people-watching on Mulberry.",
  },
  {
    id: "caffe-paradiso",
    name: "Caffe Paradiso",
    neighborhood: "Nolita",
    category: "coffee",
    cuisine: "Café",
    tags: ["walk-in", "hidden gem", "matcha", "cozy"],
    priceLevel: 2,
    penguinRating: 4,
    coords: { lat: 40.7222, lng: -73.9945 },
    hours: everyday("08:00-18:00"),
    suggestedTimeMins: 40,
    reservationNeeded: false,
    website: "https://www.instagram.com/caffeparadiso.nyc/",
    googleMapsUrl: gmaps("Caffe Paradiso Elizabeth Street Nolita"),
    authorNote:
      "Cozy little European-style espresso bar on Elizabeth St — the salted brown-butter latte and strawberry matcha are the ones to try. Sweet morning stop. (Newer spot, so peek at the maps link for hours.)",
  },

  // ── ROUND 2 ADDITIONS ───────────────────────────────────────────────────────
  {
    id: "dilli-dilli",
    name: "Dilli Dilli",
    neighborhood: "Times Square",
    category: "food",
    cuisine: "North Indian",
    tags: ["reservation", "date night", "brunch", "group-friendly"],
    priceLevel: 3,
    coords: { lat: 40.7601, lng: -73.9868 },
    hours: everyday("17:00-22:30", { sat: "12:00-15:00", sun: "12:00-15:00" }),
    reservationNeeded: true,
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/dilli-dilli",
    website: "https://www.dilli-dilli.com/",
    googleMapsUrl: gmaps("Dilli Dilli Times Square"),
    authorNote:
      "A glossy, luxe ode to Old & New Delhi — the shami kebab and butter chicken shine, plus weekend brunch and cocktails.",
  },
  {
    id: "dhamaka",
    name: "Dhamaka",
    neighborhood: "Lower East Side",
    category: "food",
    cuisine: "Regional Indian",
    tags: ["reservation", "michelin", "spicy", "iconic"],
    priceLevel: 3,
    coords: { lat: 40.7186, lng: -73.9878 },
    hours: everyday("17:00-22:00", { mon: "closed" }),
    reservationNeeded: true,
    reservationUrl: "https://www.sevenrooms.com/explore/dhamakanyc/reservations/create/search/",
    website: "https://www.dhamaka.nyc/",
    googleMapsUrl: gmaps("Dhamaka Essex Market Lower East Side"),
    authorNote:
      "The famously hard-to-book 'unapologetic' temple of regional Indian cooking — goat neck biryani and butter-pepper-garlic crab hit like a dare. Closed Mondays.",
  },
  {
    id: "kolkata-chai",
    name: "Kolkata Chai Co.",
    neighborhood: "East Village",
    category: "coffee",
    cuisine: "Chai cafe",
    tags: ["chai", "cozy", "walk-in", "vegetarian-friendly"],
    priceLevel: 1,
    coords: { lat: 40.7227, lng: -73.9835 },
    hours: everyday("09:00-19:00", { sun: "09:00-17:00" }),
    website: "https://kolkatachai.co/",
    googleMapsUrl: gmaps("Kolkata Chai Co East Village"),
    authorNote:
      "Homey South Asian cafe pulling proper cutting chai and masala chai alongside samosas. The chai-and-samosa ritual is the move.",
  },
  {
    id: "chai-spot",
    name: "The Chai Spot",
    neighborhood: "Nolita",
    category: "coffee",
    cuisine: "Chai cafe",
    tags: ["chai", "cozy", "walk-in", "hidden gem"],
    priceLevel: 1,
    coords: { lat: 40.7191, lng: -73.9961 },
    hours: hours({ wed: "15:00-22:00", thu: "15:00-22:00", fri: "15:00-22:00", sat: "12:00-22:00", sun: "12:00-22:00" }),
    website: "https://www.thechaispot.com/locations",
    googleMapsUrl: gmaps("The Chai Spot Mott Street Nolita"),
    authorNote:
      "A jewel-box, cushion-strewn Sufi-style tea room — sit on the floor sipping Kashmiri and masala chai amid handmade Pakistani textiles. Open Wed–Sun.",
  },
  {
    id: "tonchin",
    name: "Tonchin",
    neighborhood: "Midtown",
    category: "food",
    cuisine: "Ramen",
    tags: ["walk-in", "michelin", "group-friendly"],
    priceLevel: 2,
    coords: { lat: 40.7497, lng: -73.9847 },
    hours: everyday("11:30-22:00"),
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/tonchin-new-york",
    website: "https://www.tonchinus.com/",
    googleMapsUrl: gmaps("Tonchin ramen Midtown"),
    authorNote:
      "Tokyo tonkotsu ramen with silky, hours-simmered pork broth — best chased with an izakaya small plate in the airy, plant-draped room.",
  },
  {
    id: "nami-nori",
    name: "Nami Nori",
    neighborhood: "West Village",
    category: "food",
    cuisine: "Temaki hand rolls",
    tags: ["reservation", "date night", "michelin"],
    priceLevel: 3,
    coords: { lat: 40.7304, lng: -74.0031 },
    hours: everyday("11:30-21:30", { fri: "11:30-22:00", sat: "11:30-22:00" }),
    reservationNeeded: true,
    reservationUrl: "https://www.opentable.com/r/nami-nori-west-village-new-york",
    website: "https://www.naminori.us/",
    googleMapsUrl: gmaps("Nami Nori West Village"),
    authorNote:
      "Open-faced temaki hand rolls built to order at the counter — get the omakase set and finish with the yuzu soft serve.",
  },
  {
    id: "win-son",
    name: "Win Son",
    neighborhood: "East Williamsburg",
    category: "food",
    cuisine: "Taiwanese-American",
    tags: ["walk-in", "group-friendly", "date night"],
    priceLevel: 2,
    coords: { lat: 40.7115, lng: -73.944 },
    hours: everyday("17:30-23:00", { mon: "17:30-22:00", sun: "17:30-22:00" }),
    reservationUrl: "https://www.opentable.com/r/win-son-brooklyn",
    website: "https://winsonbrooklyn.com/",
    googleMapsUrl: gmaps("Win Son East Williamsburg Brooklyn"),
    authorNote:
      "Rowdy Taiwanese-American spread made for sharing — get the crispy fan tuan and the mapo tofu over Taiwan Beer with a group.",
  },
  {
    id: "moge-tee",
    name: "Moge Tee",
    neighborhood: "East Village",
    category: "sweets",
    cuisine: "Bubble tea",
    tags: ["grab & go", "late night", "sweet tooth"],
    priceLevel: 1,
    coords: { lat: 40.7285, lng: -73.9915 },
    hours: everyday("12:00-23:30", { thu: "12:00-00:00", fri: "12:00-00:00", sat: "12:00-00:00", sun: "12:00-00:00" }),
    website: "https://www.mogeteeusa.com/",
    googleMapsUrl: gmaps("Moge Tee East Village Cooper Square"),
    authorNote:
      "A late-night boba fix — go for a cheese-foam-topped milk tea or a fresh-fruit blend with chewy tapioca.",
  },
  {
    id: "thai-diner",
    name: "Thai Diner",
    neighborhood: "Nolita",
    category: "food",
    cuisine: "Thai-American",
    tags: ["brunch", "walk-in", "michelin", "group-friendly"],
    priceLevel: 2,
    coords: { lat: 40.7211, lng: -73.9954 },
    hours: everyday("08:30-22:00", { fri: "08:30-23:00", sat: "10:00-23:00", sun: "10:00-22:00" }),
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/thai-diner",
    website: "https://www.thaidiner.com/",
    googleMapsUrl: gmaps("Thai Diner Nolita"),
    authorNote:
      "All-day Thai-American diner — the Thai disco fries and roti with massaman curry are essential. Go off-peak or expect a wait.",
  },
  {
    id: "viv-thai",
    name: "Viv Thai",
    neighborhood: "Hell's Kitchen",
    category: "food",
    cuisine: "Thai",
    tags: ["walk-in", "spicy", "quick", "group-friendly"],
    priceLevel: 2,
    coords: { lat: 40.7605, lng: -73.9903 },
    hours: everyday("12:00-22:00", { fri: "12:00-23:00", sat: "12:00-23:00" }),
    website: "https://www.vivthainyc.com/",
    googleMapsUrl: gmaps("Viv Thai Hell's Kitchen 9th Ave"),
    authorNote:
      "Snug Hell's Kitchen street-food Thai — the drunken noodles and curries pack real heat.",
  },
  {
    id: "zaytinya",
    name: "Zaytinya",
    neighborhood: "NoMad",
    category: "food",
    cuisine: "Mediterranean",
    tags: ["reservation", "group-friendly", "vegetarian-friendly", "date night"],
    priceLevel: 3,
    coords: { lat: 40.7452, lng: -73.9887 },
    hours: everyday("06:30-22:30", { thu: "06:30-23:00", fri: "06:30-23:00", sat: "07:00-23:00", sun: "07:00-22:30" }),
    reservationNeeded: true,
    reservationUrl: "https://www.sevenrooms.com/reservations/zaytinyaritznomad/website",
    website: "https://www.zaytinya.com/location/new-york/",
    googleMapsUrl: gmaps("Zaytinya NoMad"),
    authorNote:
      "José Andrés's Turkish/Greek/Lebanese mezze, built for the table — order wide and don't skip the crispy brussels sprouts.",
  },
  {
    id: "kyma",
    name: "Kyma",
    neighborhood: "Flatiron",
    category: "food",
    cuisine: "Greek",
    tags: ["reservation", "date night", "group-friendly", "scene"],
    priceLevel: 3,
    coords: { lat: 40.7386, lng: -73.9925 },
    hours: everyday("11:30-22:00", { thu: "11:30-23:00", fri: "11:30-00:00", sat: "11:30-00:00" }),
    reservationNeeded: true,
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/kyma-flatiron",
    website: "https://kymarestaurants.com/",
    googleMapsUrl: gmaps("Kyma Flatiron"),
    authorNote:
      "Pick your whole fish straight off the ice for a simple, char-grilled, olive-oil-and-lemon Aegean seafood feast.",
  },
  {
    id: "sartianos",
    name: "Sartiano's",
    neighborhood: "SoHo",
    category: "food",
    cuisine: "Italian",
    tags: ["reservation", "scene", "date night", "late night"],
    priceLevel: 4,
    coords: { lat: 40.7245, lng: -73.9985 },
    hours: everyday("07:00-22:30", { sun: "07:00-22:00" }),
    reservationNeeded: true,
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/sartianos",
    website: "https://www.sartianos.com/",
    googleMapsUrl: gmaps("Sartiano's Mercer Hotel SoHo"),
    authorNote:
      "See-and-be-seen Italian at The Mercer — the spicy rigatoni comes with celebrity-spotting and a nearly impossible reservation.",
  },
  {
    id: "milano-market",
    name: "Milano Market",
    neighborhood: "Upper West Side",
    category: "food",
    cuisine: "Italian deli",
    tags: ["walk-in", "quick", "group-friendly"],
    priceLevel: 2,
    coords: { lat: 40.804, lng: -73.9666 },
    hours: everyday("06:00-23:00"),
    website: "https://milanomarketwestside.com/",
    googleMapsUrl: gmaps("Milano Market Upper West Side"),
    authorNote:
      "Beloved UWS gourmet deli — the overstuffed made-to-order Italian sandwiches and prepared-food counter are the draw.",
  },
  {
    id: "bubbys",
    name: "Bubby's",
    neighborhood: "Tribeca",
    category: "food",
    cuisine: "American",
    tags: ["brunch", "iconic", "group-friendly"],
    priceLevel: 2,
    coords: { lat: 40.7195, lng: -74.009 },
    hours: everyday("08:00-22:00"),
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/bubbys-tribeca",
    website: "https://www.bubbys.com/",
    googleMapsUrl: gmaps("Bubby's Tribeca"),
    authorNote:
      "Decades-old Tribeca comfort-food institution — the homemade sour cream pancakes and a slice of from-scratch pie are the move.",
  },
  {
    id: "jacks-wife-freda",
    name: "Jack's Wife Freda",
    neighborhood: "SoHo",
    category: "food",
    cuisine: "Mediterranean",
    tags: ["brunch", "iconic", "walk-in", "group-friendly"],
    priceLevel: 2,
    coords: { lat: 40.7211, lng: -73.9971 },
    hours: everyday("08:30-22:00", { fri: "08:30-23:00", sat: "08:30-23:00", sun: "08:30-21:00" }),
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/jacks-wife-freda-soho",
    website: "https://jackswifefreda.com/",
    googleMapsUrl: gmaps("Jack's Wife Freda SoHo"),
    authorNote:
      "The buzzy all-day cafe that defined downtown brunch — get the green shakshuka and the rosewater waffles.",
  },
  {
    id: "clinton-st-baking",
    name: "Clinton St. Baking Company",
    neighborhood: "Lower East Side",
    category: "food",
    cuisine: "American",
    tags: ["brunch", "iconic", "long lines", "walk-in"],
    priceLevel: 2,
    coords: { lat: 40.7217, lng: -73.984 },
    hours: hours({ mon: "08:30-15:30", tue: "08:30-15:30", wed: "08:30-22:00", thu: "08:30-22:00", fri: "08:30-22:00", sat: "08:30-22:00", sun: "08:30-16:00" }),
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/clinton-st-baking-co",
    website: "https://www.clintonstreetbaking.com/",
    googleMapsUrl: gmaps("Clinton St Baking Company Lower East Side"),
    authorNote:
      "Famous fluffy pancakes with warm maple butter — the weekend line is walk-in; dinner (Wed–Sat) takes Resy.",
  },
  {
    id: "prince-street-pizza",
    name: "Prince Street Pizza",
    neighborhood: "Nolita",
    category: "food",
    cuisine: "Pizza",
    tags: ["walk-in", "long lines", "iconic", "quick"],
    priceLevel: 1,
    coords: { lat: 40.7229, lng: -73.9942 },
    hours: hours({ mon: "10:00-03:00", tue: "10:00-03:00", wed: "10:00-00:00", thu: "10:00-05:00", fri: "10:00-05:00", sat: "10:00-05:00", sun: "10:00-03:00" }),
    website: "https://princestreetpizza.com/",
    googleMapsUrl: gmaps("Prince Street Pizza Nolita"),
    authorNote:
      "The Spicy Spring square — crispy curled pepperoni cups over garlicky sauce — is worth the perpetual sidewalk line.",
  },
  {
    id: "uluh",
    name: "Uluh",
    neighborhood: "East Village",
    category: "food",
    cuisine: "Chinese",
    tags: ["walk-in", "group-friendly", "date night", "spicy"],
    priceLevel: 3,
    coords: { lat: 40.7285, lng: -73.9868 },
    hours: everyday("11:30-22:15", { fri: "11:30-22:45", sat: "11:30-22:45" }),
    website: "https://www.uluhny.com/",
    googleMapsUrl: gmaps("Uluh 2nd Ave East Village"),
    authorNote:
      "Buzzy East Village Chinese tea-house doing creative regional plates — no reservations, so join the waitlist line online.",
  },
  {
    id: "standard-biergarten",
    name: "The Standard Biergarten",
    neighborhood: "Meatpacking District",
    category: "drinks",
    cuisine: "Beer garden",
    tags: ["walk-in", "outdoor", "group-friendly", "scene"],
    priceLevel: 2,
    coords: { lat: 40.7407, lng: -74.008 },
    hours: hours({ mon: "15:00-23:00", tue: "15:00-23:00", wed: "15:00-23:00", thu: "14:00-23:00", fri: "14:00-02:00", sat: "12:00-02:00", sun: "12:00-23:00" }),
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/the-standard-biergarten",
    website: "https://www.standardhotels.com/new-york/features/biergarten-nyc",
    googleMapsUrl: gmaps("The Standard Biergarten Meatpacking High Line"),
    authorNote:
      "Rowdy open-air Bavarian beer garden tucked under the High Line — liter steins, pretzels and ping-pong. Peak summer day-drinking.",
  },
  {
    id: "dante",
    name: "Dante",
    neighborhood: "Greenwich Village",
    category: "drinks",
    cuisine: "Cocktail bar",
    tags: ["iconic", "date night", "walk-in", "happy hour"],
    priceLevel: 3,
    coords: { lat: 40.7289, lng: -74.0027 },
    hours: everyday("10:00-00:00"),
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/dante",
    website: "https://www.dante-nyc.com/",
    googleMapsUrl: gmaps("Dante MacDougal Street Greenwich Village"),
    authorNote:
      "Century-old Village aperitivo institution and former World's Best Bar — Negroni flights and the award-winning Garibaldi.",
  },
  {
    id: "bibliotheque",
    name: "Bibliothèque",
    neighborhood: "SoHo",
    category: "drinks",
    cuisine: "Wine bar & cafe",
    tags: ["hidden gem", "date night", "walk-in"],
    priceLevel: 2,
    coords: { lat: 40.7216, lng: -74.0021 },
    hours: everyday("10:00-22:00", { fri: "10:00-23:00", sat: "10:00-23:00" }),
    website: "https://www.bibliothequenyc.com/",
    googleMapsUrl: gmaps("Bibliotheque Mercer Street SoHo"),
    authorNote:
      "A bookstore-cafe by day that turns into a candlelit wine bar by night, surrounded by 10,000 books.",
  },
  {
    id: "superbueno",
    name: "Superbueno",
    neighborhood: "East Village",
    category: "drinks",
    cuisine: "Mexican cocktails",
    tags: ["scene", "late night", "date night", "reservation"],
    priceLevel: 3,
    coords: { lat: 40.7234, lng: -73.9886 },
    hours: everyday("16:00-02:00", { fri: "14:00-02:00", sat: "14:00-02:00", sun: "14:00-02:00" }),
    reservationNeeded: true,
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/superbueno",
    website: "https://www.superbuenonyc.com/",
    googleMapsUrl: gmaps("Superbueno East Village"),
    authorNote:
      "Award-winning Mexican-inspired cocktails — playful horchata riffs and a buzzing East Village crowd.",
  },
  {
    id: "acme",
    name: "Acme",
    neighborhood: "NoHo",
    category: "drinks",
    cuisine: "Restaurant & DJ lounge",
    tags: ["late night", "dancing", "scene", "group-friendly"],
    priceLevel: 3,
    coords: { lat: 40.7266, lng: -73.9928 },
    hours: hours({ thu: "22:00-04:00", fri: "22:00-04:00", sat: "22:00-04:00" }),
    website: "https://www.acmenyc.com/",
    googleMapsUrl: gmaps("Acme Great Jones Street NoHo"),
    authorNote:
      "A Great Jones bistro whose below-ground den spins DJ sets and cocktails deep into the night. Dance floor Thu–Sat.",
  },
  {
    id: "maison-close",
    name: "Maison Close",
    neighborhood: "SoHo",
    category: "food",
    cuisine: "French · dinner & a show",
    tags: ["dinner and a show", "dancing", "scene", "late night"],
    priceLevel: 3,
    coords: { lat: 40.7233, lng: -74.0037 },
    hours: hours({ tue: "18:00-00:00", wed: "18:00-00:00", thu: "18:00-02:00", fri: "18:00-02:00", sat: "12:00-02:00", sun: "12:00-19:00" }),
    reservationNeeded: true,
    reservationUrl: "https://resy.com/cities/new-york-ny/venues/maison-close",
    website: "https://maisoncloserestaurant.com/",
    googleMapsUrl: gmaps("Maison Close Watts Street SoHo"),
    authorNote:
      "French plates give way around 11:30pm to burlesque dancers, a live chanteuse and a full-on tabletop dance party.",
  },
  {
    id: "birdee",
    name: "Birdee",
    neighborhood: "Williamsburg",
    category: "sweets",
    cuisine: "Bakery",
    tags: ["walk-in", "grab & go", "sweet tooth", "bakery"],
    priceLevel: 2,
    coords: { lat: 40.7108, lng: -73.9673 },
    hours: everyday("08:00-17:00"),
    website: "https://www.birdee.nyc/",
    googleMapsUrl: gmaps("Birdee bakery Williamsburg Brooklyn"),
    authorNote:
      "Sunny Williamsburg corner spot for flaky morning pastries and a well-pulled coffee to go.",
  },
  {
    id: "lafayette",
    name: "Lafayette Grand Café & Bakery",
    neighborhood: "NoHo",
    category: "food",
    cuisine: "French café & bakery",
    tags: ["brunch", "bakery", "iconic", "long lines"],
    priceLevel: 3,
    coords: { lat: 40.7267, lng: -73.9925 },
    hours: everyday("08:00-21:30", { mon: "08:00-21:00", sun: "08:00-17:00" }),
    website: "https://www.lafayetteny.com/",
    googleMapsUrl: gmaps("Lafayette Grand Cafe Bakery NoHo"),
    authorNote:
      "The blueberry-buttermilk muffin is the legend, but the whole French pastry case (and the brasserie) is worth the detour.",
  },
  {
    id: "la-cabra",
    name: "La Cabra",
    neighborhood: "East Village",
    category: "coffee",
    cuisine: "Coffee & bakery",
    tags: ["walk-in", "cozy", "grab & go", "sweet tooth"],
    priceLevel: 2,
    coords: { lat: 40.7291, lng: -73.9877 },
    hours: everyday("07:00-18:00", { sat: "08:00-18:00", sun: "08:00-18:00" }),
    website: "https://us.lacabra.com/pages/east-village",
    googleMapsUrl: gmaps("La Cabra coffee East Village"),
    authorNote:
      "The Danish roaster's original NYC café — a rotating pour-over plus an impossibly buttery cardamom bun.",
  },
  {
    id: "radio-bakery",
    name: "Radio Bakery",
    neighborhood: "Greenpoint",
    category: "sweets",
    cuisine: "Bakery",
    tags: ["long lines", "grab & go", "iconic", "bakery"],
    priceLevel: 2,
    coords: { lat: 40.7324, lng: -73.955 },
    hours: everyday("07:30-15:30"),
    website: "https://www.radiobakery.nyc/",
    googleMapsUrl: gmaps("Radio Bakery Greenpoint Brooklyn"),
    authorNote:
      "Get there early for the cult pepperoni-and-cheese roll before the whole case sells out.",
  },
  {
    id: "librae",
    name: "Librae Bakery",
    neighborhood: "East Village",
    category: "sweets",
    cuisine: "Bakery",
    tags: ["walk-in", "cozy", "sweet tooth", "bakery"],
    priceLevel: 2,
    coords: { lat: 40.7285, lng: -73.991 },
    hours: everyday("07:30-16:30", { sat: "08:00-17:00", sun: "08:00-17:00" }),
    website: "https://www.libraebakery.com/",
    googleMapsUrl: gmaps("Librae Bakery Cooper Square East Village"),
    authorNote:
      "Middle Eastern roots meet Danish technique — the date-and-tahini bun you'll think about for days.",
  },
  {
    id: "venchi",
    name: "Venchi",
    neighborhood: "West Village",
    category: "sweets",
    cuisine: "Chocolate & gelato",
    tags: ["walk-in", "sweet tooth", "grab & go", "cozy"],
    priceLevel: 2,
    coords: { lat: 40.7318, lng: -74.0034 },
    hours: everyday("11:30-23:00", { fri: "11:00-00:00", sat: "11:00-00:00" }),
    website: "https://us.venchi.com/",
    googleMapsUrl: gmaps("Venchi chocolate gelato West Village"),
    authorNote:
      "Watch the chocolate waterfall while a scoop of dark-chocolate gelato drips over a fresh cone.",
  },
  {
    id: "van-leeuwen",
    name: "Van Leeuwen Ice Cream",
    neighborhood: "East Village",
    category: "sweets",
    cuisine: "Ice cream",
    tags: ["walk-in", "grab & go", "sweet tooth", "vegetarian-friendly"],
    priceLevel: 2,
    coords: { lat: 40.7274, lng: -73.9856 },
    hours: everyday("12:00-00:00"),
    website: "https://vanleeuwenicecream.com/",
    googleMapsUrl: gmaps("Van Leeuwen Ice Cream East Village"),
    authorNote:
      "The honeycomb and vegan cookie-dough scoops are the move at this East Village walk-up window.",
  },
];

// ── Curation overrides (edited via the dev-only /studio page) ────────────────
// data/curation.json maps a place id → the fields Anusha has curated. These are
// merged on top of the base data above, so they win in the real site.
export type Curation = Partial<
  Pick<Place, "category" | "tags" | "authorNote" | "isFav">
>;

const CURATION = curationData as unknown as Record<string, Curation>;

export const PLACES: Place[] = RAW_PLACES.map((p) => {
  const override = CURATION[p.id];
  return override ? { ...p, ...override } : p;
});

// ── Derived filter lists ─────────────────────────────────────────────────────
export const CATEGORIES = Array.from(
  new Set(PLACES.map((p) => p.category)),
) as Category[];

export const NEIGHBORHOODS = Array.from(
  new Set(PLACES.map((p) => p.neighborhood)),
).sort();

export const CUISINES = Array.from(
  new Set(PLACES.map((p) => p.cuisine).filter(Boolean) as string[]),
).sort();

export const ALL_TAGS = Array.from(
  new Set(PLACES.flatMap((p) => p.tags)),
).sort();

export function getPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}
