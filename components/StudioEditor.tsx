"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Category } from "@/data/places";

export type StudioPlace = {
  id: string;
  name: string;
  neighborhood: string;
  cuisine: string;
  category: Category;
  tags: string[];
  authorNote: string;
  isFav: boolean;
};

const DRAFT_KEY = "dailywaddle:studio-draft";

export default function StudioEditor({
  places,
  categories,
}: {
  places: StudioPlace[];
  categories: { value: string; label: string }[];
}) {
  const [rows, setRows] = useState<StudioPlace[]>(places);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("");
  const [dirty, setDirty] = useState(false);
  const mounted = useRef(false);

  // Restore an autosaved draft (if any) once on mount. We overlay the draft
  // onto the live `places` by id, so newly-added places still show up and any
  // edits you hadn't saved are recovered. Guarded for SSR.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as StudioPlace[];
        const byId = new Map(draft.map((d) => [d.id, d]));
        setRows(places.map((p) => byId.get(p.id) ?? p));
        setDirty(true);
        setStatus("↩ Restored your unsaved draft. Click Save all to write it to the file.");
      }
    } catch {
      /* ignore malformed draft */
    }
    mounted.current = true;
  }, [places]);

  // Autosave every edit to localStorage. Only writes once something is dirty,
  // so an untouched session never leaves a stale draft behind.
  useEffect(() => {
    if (!mounted.current || !dirty) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rows));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [rows, dirty]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      `${r.name} ${r.neighborhood} ${r.cuisine} ${r.tags.join(" ")}`
        .toLowerCase()
        .includes(q),
    );
  }, [rows, query]);

  // Every tag that already exists anywhere — powers tag autocomplete.
  const allTags = useMemo(
    () => Array.from(new Set(rows.flatMap((r) => r.tags))).sort(),
    [rows],
  );

  const update = (id: string, patch: Partial<StudioPlace>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setDirty(true);
    setStatus("");
  };

  const save = async () => {
    setStatus("Saving…");
    const overrides = Object.fromEntries(
      rows.map((r) => [
        r.id,
        { category: r.category, tags: r.tags, authorNote: r.authorNote, isFav: r.isFav },
      ]),
    );
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(overrides),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setStatus(`Saved ✓ (${json.count} places). Refresh the real site to see it.`);
      setDirty(false);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    } catch (e) {
      setStatus(`⚠️ ${e instanceof Error ? e.message : "Save failed"}`);
    }
  };

  const discardDraft = () => {
    if (!confirm("Discard your local draft and reload the saved file's data?")) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setRows(places);
    setDirty(false);
    setStatus("Draft discarded — showing the last saved data.");
  };

  const favCount = rows.filter((r) => r.isFav).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="sticky top-0 z-20 -mx-4 mb-4 border-b-2 border-ink bg-cream px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-3xl uppercase leading-none">Studio 🐧</h1>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink/60">
              Dev-only · {rows.length} places · {favCount} favs
              {dirty ? " · ● unsaved (autosaved locally)" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <button
                type="button"
                onClick={discardDraft}
                className="min-h-[44px] border-2 border-hotred px-3 font-mono text-xs font-bold uppercase text-hotred transition-transform active:scale-95"
              >
                Discard draft
              </button>
            )}
            <button
              type="button"
              onClick={save}
              className={`min-h-[44px] border-2 border-ink px-4 font-display text-xl uppercase transition-transform active:scale-95 ${
                dirty ? "bg-park text-paper" : "bg-taxi text-ink"
              }`}
            >
              💾 Save all
            </button>
          </div>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter places…"
          className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none"
        />
        {status && (
          <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-park">
            {status}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {filtered.map((r) => (
          <Row key={r.id} row={r} categories={categories} allTags={allTags} onChange={update} />
        ))}
      </div>

      <div className="h-24" />
    </main>
  );
}

function Row({
  row,
  categories,
  allTags,
  onChange,
}: {
  row: StudioPlace;
  categories: { value: string; label: string }[];
  allTags: string[];
  onChange: (id: string, patch: Partial<StudioPlace>) => void;
}) {
  const [newTag, setNewTag] = useState("");

  const removeTag = (t: string) =>
    onChange(row.id, { tags: row.tags.filter((x) => x !== t) });

  const addTagValue = (raw: string) => {
    const t = raw.trim().toLowerCase();
    if (t && !row.tags.includes(t)) onChange(row.id, { tags: [...row.tags, t] });
    setNewTag("");
  };

  // Existing tags this place doesn't already have, matching what's typed.
  const suggestions = useMemo(() => {
    const q = newTag.trim().toLowerCase();
    if (!q) return [];
    return allTags
      .filter((t) => !row.tags.includes(t) && t.includes(q) && t !== q)
      .slice(0, 8);
  }, [newTag, allTags, row.tags]);

  const listId = `tags-${row.id}`;

  return (
    <section className={`paper p-3 ${row.isFav ? "bg-taxi/20" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display text-xl uppercase leading-none">{row.name}</h2>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink/50">
            {row.neighborhood}
            {row.cuisine ? ` · ${row.cuisine}` : ""} · {row.id}
          </p>
        </div>
        <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
          <input
            type="checkbox"
            checked={row.isFav}
            onChange={(e) => onChange(row.id, { isFav: e.target.checked })}
            className="h-5 w-5 accent-hotpink"
          />
          ★ Fav
        </label>
      </div>

      {/* Category */}
      <div className="mt-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink/50">Category</span>
        <select
          value={row.category}
          onChange={(e) => onChange(row.id, { category: e.target.value as Category })}
          className="border-2 border-ink bg-paper px-2 py-1 font-mono text-xs font-bold uppercase outline-none"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="mt-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink/50">
          Tags (click ✕ to drop)
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {row.tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => removeTag(t)}
              className="group inline-flex items-center gap-1 border border-ink/50 px-1.5 py-0.5 font-mono text-[11px] lowercase hover:border-hotred hover:text-hotred"
            >
              #{t} <span className="font-bold">✕</span>
            </button>
          ))}
          <span className="inline-flex">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              list={listId}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTagValue(newTag);
                }
              }}
              placeholder="+ add tag"
              className="w-24 border border-dashed border-ink/50 px-1.5 py-0.5 font-mono text-[11px] lowercase outline-none"
            />
            <datalist id={listId}>
              {allTags
                .filter((t) => !row.tags.includes(t))
                .map((t) => (
                  <option key={t} value={t} />
                ))}
            </datalist>
          </span>
        </div>
        {suggestions.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <span className="font-mono text-[9px] uppercase tracking-wide text-ink/40">
              existing:
            </span>
            {suggestions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addTagValue(t)}
                className="border border-park/60 bg-park/10 px-1.5 py-0.5 font-mono text-[11px] lowercase text-park hover:bg-park hover:text-paper"
              >
                +#{t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <div className="mt-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink/50">
          Your note (blank = hidden on the site)
        </p>
        <textarea
          value={row.authorNote}
          onChange={(e) => onChange(row.id, { authorNote: e.target.value })}
          rows={2}
          className="mt-1 w-full border-2 border-ink bg-paper px-2 py-1.5 font-serif text-sm outline-none"
        />
      </div>
    </section>
  );
}
