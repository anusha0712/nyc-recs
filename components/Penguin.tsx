// A little cartoon penguin mascot, drawn inline so it's crisp at any size and
// can be tinted / posed. `accessory` adds a summer-in-NYC prop.

type PenguinProps = {
  className?: string;
  accessory?: "none" | "sunglasses" | "hotdog" | "map";
  title?: string;
};

export default function Penguin({
  className,
  accessory = "none",
  title = "A friendly penguin",
}: PenguinProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* feet */}
      <ellipse cx="45" cy="132" rx="14" ry="6" fill="#ffcf24" stroke="#141210" strokeWidth="3" />
      <ellipse cx="75" cy="132" rx="14" ry="6" fill="#ffcf24" stroke="#141210" strokeWidth="3" />
      {/* body */}
      <path
        d="M60 12 C30 12 20 46 20 82 C20 118 38 132 60 132 C82 132 100 118 100 82 C100 46 90 12 60 12 Z"
        fill="#141210"
        stroke="#141210"
        strokeWidth="3"
      />
      {/* belly */}
      <path
        d="M60 34 C42 34 34 58 34 84 C34 110 46 122 60 122 C74 122 86 110 86 84 C86 58 78 34 60 34 Z"
        fill="#fffaf0"
      />
      {/* wings */}
      <path d="M22 66 C10 78 12 98 24 104 L30 96 C22 90 22 78 30 70 Z" fill="#141210" />
      <path d="M98 66 C110 78 108 98 96 104 L90 96 C98 90 98 78 90 70 Z" fill="#141210" />
      {/* eyes */}
      <circle cx="50" cy="60" r="7" fill="#fffaf0" stroke="#141210" strokeWidth="2" />
      <circle cx="70" cy="60" r="7" fill="#fffaf0" stroke="#141210" strokeWidth="2" />
      <circle cx="51" cy="61" r="3" fill="#141210" />
      <circle cx="71" cy="61" r="3" fill="#141210" />
      {/* beak */}
      <path d="M54 70 L66 70 L60 80 Z" fill="#ff8a1f" stroke="#141210" strokeWidth="2" />
      {/* cheeks */}
      <circle cx="42" cy="72" r="4" fill="#ff4d9d" opacity="0.7" />
      <circle cx="78" cy="72" r="4" fill="#ff4d9d" opacity="0.7" />

      {accessory === "sunglasses" && (
        <g stroke="#141210" strokeWidth="3">
          <rect x="40" y="54" width="18" height="12" rx="4" fill="#2ea6e6" />
          <rect x="62" y="54" width="18" height="12" rx="4" fill="#2ea6e6" />
          <line x1="58" y1="58" x2="62" y2="58" />
        </g>
      )}
      {accessory === "hotdog" && (
        <g stroke="#141210" strokeWidth="2">
          <rect x="88" y="86" width="30" height="12" rx="6" fill="#ffcf24" transform="rotate(-18 103 92)" />
          <rect x="92" y="84" width="24" height="6" rx="3" fill="#ff3b2f" transform="rotate(-18 104 87)" />
        </g>
      )}
      {accessory === "map" && (
        <g stroke="#141210" strokeWidth="2">
          <rect x="86" y="80" width="26" height="20" rx="2" fill="#fffaf0" transform="rotate(-10 99 90)" />
          <line x1="90" y1="86" x2="108" y2="86" transform="rotate(-10 99 90)" stroke="#ff3b2f" />
          <line x1="90" y1="92" x2="104" y2="92" transform="rotate(-10 99 90)" stroke="#2ea6e6" />
        </g>
      )}
    </svg>
  );
}
