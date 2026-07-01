import Link from "next/link";

// The newspaper nameplate. `compact` is used on interior pages.
export default function Masthead({
  compact = false,
  dateline,
}: {
  compact?: boolean;
  dateline?: string;
}) {
  return (
    <header
      className={`border-b-4 border-double border-ink ${compact ? "py-2" : "py-3"}`}
    >
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink/60">
          <span>Vol. 1 · Summer Ed.</span>
          <span>{dateline ?? "The Anusha-Approved Press"}</span>
        </div>
        <Link href="/" className="mt-4 block text-center">
          <h1
            className={`font-display uppercase leading-[0.85] tracking-tight ${
              compact ? "text-3xl" : "text-5xl sm:text-6xl"
            }`}
          >
            The Daily Bite
          </h1>
        </Link>
        {!compact && (
          <p className="mt-1 text-center font-serif text-sm italic text-ink/70">
            happy late nights in the middle of july
          </p>
        )}
      </div>
    </header>
  );
}
