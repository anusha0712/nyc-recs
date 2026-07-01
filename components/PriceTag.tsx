export default function PriceTag({ level }: { level: 1 | 2 | 3 | 4 }) {
  return (
    <span
      className="font-mono text-sm font-bold"
      aria-label={`Price level ${level} of 4`}
      title={`${"$".repeat(level)} of $$$$`}
    >
      <span className="text-park">{"$".repeat(level)}</span>
      <span className="text-ink/30">{"$".repeat(4 - level)}</span>
    </span>
  );
}
