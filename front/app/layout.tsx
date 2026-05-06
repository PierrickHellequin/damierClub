import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const meta = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-meta",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Damier Club — Le journal des clubs de jeu de dames",
    template: "%s · Damier Club",
  },
  description:
    "Actualités, résultats et annuaire des clubs affiliés à la fédération de jeu de dames.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Damier Club",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${serif.variable} ${meta.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Masthead />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
