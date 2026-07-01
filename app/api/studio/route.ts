import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

// Dev-only: persists the studio's curation edits to data/curation.json on disk.
// (Never runs in production — the filesystem is read-only there anyway.)
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Studio is dev-only." }, { status: 403 });
  }
  try {
    const body = await req.json();
    const file = path.join(process.cwd(), "data", "curation.json");
    await fs.writeFile(file, JSON.stringify(body, null, 2) + "\n", "utf8");
    return NextResponse.json({ ok: true, count: Object.keys(body ?? {}).length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save." },
      { status: 500 },
    );
  }
}
