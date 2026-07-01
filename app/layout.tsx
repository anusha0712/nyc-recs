import type { Metadata, Viewport } from "next";
import { Anton, Fraunces, DM_Mono } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/MobileNav";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Daily Bite 🐧 — Samira & Ava's NYC Summer",
  description:
    "A hand-picked, penguin-approved guide to New York City — recs, hours, notes, and a 4-day itinerary builder made just for you.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "The Daily Bite",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffcf24",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${fraunces.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-20">
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
