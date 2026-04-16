import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#00342b",
          colorText: "#1a2b32",
          colorTextSecondary: "#40555e",
          colorBackground: "#ffffff",
          colorInputBackground: "#eef3f8",
          colorInputText: "#1a2b32",
          borderRadius: "0.5rem",
          fontFamily: "var(--font-inter), sans-serif",
        },
        elements: {
          formButtonPrimary:
            "bg-[#00342b] hover:bg-[#00684f] text-white font-semibold",
          card: "shadow-none",
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
