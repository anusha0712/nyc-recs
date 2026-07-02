import { notFound } from "next/navigation";
import { PLACES, CATEGORIES, CATEGORY_META } from "@/data/places";
import StudioEditor, { type StudioPlace } from "@/components/StudioEditor";

// Dev-only curation console. 404s in production.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Studio — The Daily Bite (dev)",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const places: StudioPlace[] = PLACES.map((p) => ({
    id: p.id,
    name: p.name,
    neighborhood: p.neighborhood,
    cuisine: p.cuisine ?? "",
    category: p.category,
    tags: p.tags,
    authorNote: p.authorNote,
    isFav: Boolean(p.isFav),
  }));

  const categories = CATEGORIES.map((c) => ({
    value: c,
    label: `${CATEGORY_META[c].emoji} ${CATEGORY_META[c].label}`,
  }));

  return <StudioEditor places={places} categories={categories} />;
}
