"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PLACES,
  CATEGORIES,
  NEIGHBORHOODS,
  CUISINES,
  CATEGORY_META,
  type Category,
} from "@/data/places";
import { isOpenNow } from "@/lib/hours";
import {
  saveRecsScroll,
  takeRecsReturn,
  useIsomorphicLayoutEffect,
} from "@/lib/recsScroll";
import PlaceCard from "@/components/PlaceCard";

type SortKey = "fav" | "az" | "price";

// Persist the active filter set so returning from a place restores the same
// list — otherwise a restored scroll offset would point at different content.
const FILTERS_KEY = "dailywaddle:recsFilters";

export default function RecsBrowser() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [hood, setHood] = useState<string>("all");
  const [cuisine, setCuisine] = useState<string>("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [favOnly, setFavOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("fav");
  // Defaults match the server render; persisted state is applied after mount
  // (below) so there's no hydration mismatch.
  const [hydrated, setHydrated] = useState(false);
  const didRestore = useRef(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PLACES.filter((p) => {
      if (favOnly && !p.isFav) return false;
      if (cat !== "all" && p.category !== cat) return false;
      if (hood !== "all" && p.neighborhood !== hood) return false;
      if (cuisine !== "all" && p.cuisine !== cuisine) return false;
      if (openOnly && !isOpenNow(p).open) return false;
      if (q) {
        const hay = `${p.name} ${p.neighborhood} ${p.cuisine ?? ""} ${p.tags.join(
          " ",
        )}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "price") return a.priceLevel - b.priceLevel;
      // fav: favorites first, then alphabetical
      return Number(Boolean(b.isFav)) - Number(Boolean(a.isFav)) || a.name.localeCompare(b.name);
    });
  }, [query, cat, hood, cuisine, openOnly, favOnly, sort]);

  const activeFilters = [
    cat !== "all",
    hood !== "all",
    cuisine !== "all",
    openOnly,
    favOnly,
  ].filter(Boolean).length;

  const reset = () => {
    setCat("all");
    setHood("all");
    setCuisine("all");
    setOpenOnly(false);
    setFavOnly(false);
    setQuery("");
  };

  // Restore the filter set we left with, before the browser paints.
  useIsomorphicLayoutEffect(() => {
    try {
      const raw = sessionStorage.getItem(FILTERS_KEY);
      if (raw) {
        const f = JSON.parse(raw);
        if (typeof f.query === "string") setQuery(f.query);
        if (f.cat) setCat(f.cat);
        if (f.hood) setHood(f.hood);
        if (f.cuisine) setCuisine(f.cuisine);
        if (typeof f.openOnly === "boolean") setOpenOnly(f.openOnly);
        if (typeof f.favOnly === "boolean") setFavOnly(f.favOnly);
        if (f.sort) setSort(f.sort);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Once filters are applied and the grid has laid out, jump back to where we
  // left off — seamless, no flash to the top.
  useIsomorphicLayoutEffect(() => {
    if (!hydrated || didRestore.current) return;
    didRestore.current = true;
    const back = takeRecsReturn();
    if (back) window.scrollTo(0, back.y);
  }, [hydrated]);

  // Persist filter changes (after the initial restore, so we don't clobber them).
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        FILTERS_KEY,
        JSON.stringify({ query, cat, hood, cuisine, openOnly, favOnly, sort }),
      );
    } catch {}
  }, [hydrated, query, cat, hood, cuisine, openOnly, favOnly, sort]);

  // Keep the scroll offset fresh while browsing (rAF-throttled).
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        saveRecsScroll();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      {/* Search */}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search spots, food, vibes…"
        aria-label="Search recommendations"
        className="w-full border-2 border-ink bg-paper px-3 py-3 font-mono text-sm shadow-[3px_3px_0_0_#141210] outline-none placeholder:text-ink/40 focus:bg-cream"
      />

      {/* Category chips — wrap to fit the width, no horizontal scroll */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip active={favOnly} onClick={() => setFavOnly((v) => !v)}>
          ★ Favs
        </Chip>
        <Chip active={cat === "all" && !favOnly} onClick={() => { setCat("all"); }}>
          All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
            {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
          </Chip>
        ))}
      </div>

      {/* Secondary filters */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Select value={hood} onChange={setHood} label="Neighborhood">
          <option value="all">All areas</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
        {CUISINES.length > 0 && (
          <Select value={cuisine} onChange={setCuisine} label="Cuisine">
            <option value="all">All cuisines</option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        )}
        <label className="inline-flex min-h-[36px] items-center gap-1.5 border-2 border-ink bg-paper px-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-ink/50">
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-transparent py-1 font-mono text-xs font-bold uppercase outline-none"
          >
            <option value="fav">Top picks</option>
            <option value="az">A–Z</option>
            <option value="price">$ Low→High</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => setOpenOnly((v) => !v)}
          aria-pressed={openOnly}
          className={`min-h-[36px] border-2 border-ink px-2.5 font-mono text-xs font-bold uppercase transition-transform active:scale-95 ${
            openOnly ? "bg-park text-paper" : "bg-paper"
          }`}
        >
          Open now
        </button>
        {activeFilters > 0 && (
          <button
            type="button"
            onClick={reset}
            className="min-h-[36px] border-2 border-hotred px-2.5 font-mono text-xs font-bold uppercase text-hotred transition-transform active:scale-95"
          >
            Clear ✕
          </button>
        )}
      </div>

      {/* Count */}
      <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ink/50">
        {results.length} {results.length === 1 ? "spot" : "spots"}
      </p>

      {/* Grid */}
      {results.length === 0 ? (
        <div className="paper mt-3 p-6 text-center">
          <p className="font-display text-2xl uppercase">No spots match</p>
          <p className="mt-1 font-serif italic text-ink/70">
            Try clearing a filter — the penguin can’t find anything. 🐧
          </p>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {results.map((p, i) => (
            <PlaceCard key={p.id} place={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-transform active:scale-95 ${
        active ? "bg-ink text-paper shadow-[2px_2px_0_0_#141210]" : "bg-paper"
      }`}
    >
      {children}
    </button>
  );
}

function Select({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="inline-flex">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[36px] border-2 border-ink bg-paper px-2 font-mono text-xs font-bold uppercase outline-none focus:bg-cream"
      >
        {children}
      </select>
    </label>
  );
}
