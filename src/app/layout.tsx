import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Smart Scribe — The Clinical Scribe that Really Listens",
  description:
    "AI Smart Scribe ambiently captures patient visits and generates precise SOAP notes in real-time — so you can focus on your patient, not your keyboard.",
  metadataBase: new URL("https://aismartscribe.com"),
  openGraph: {
    title: "AI Smart Scribe — The Clinical Scribe that Really Listens",
    description:
      "Ambient AI scribe for independent optometry and medical practices. HIPAA compliant.",
    url: "https://aismartscribe.com",
    siteName: "AI Smart Scribe",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
