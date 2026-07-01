"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Cover", icon: "📰" },
  { href: "/recs", label: "Recs", icon: "🍕" },
  { href: "/itinerary", label: "Trip", icon: "🗓️" },
  { href: "/map", label: "Map", icon: "🗺️" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t-2 border-ink bg-paper"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-mono uppercase tracking-wide transition-transform active:scale-90 ${
                  active ? "bg-taxi text-ink" : "text-ink/70"
                }`}
              >
                <span className="text-xl leading-none" aria-hidden>
                  {tab.icon}
                </span>
                <span className={active ? "font-bold" : ""}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
