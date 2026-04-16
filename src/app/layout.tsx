import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
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
  title: {
    default: "AI Smart Scribe — The Clinical Scribe that Really Listens",
    template: "%s · AI Smart Scribe",
  },
  description:
    "AI Smart Scribe ambiently captures patient visits and generates precise SOAP notes in real-time — so you can focus on your patient, not your keyboard.",
  metadataBase: new URL("https://aismartscribe.com"),
  applicationName: "AI Smart Scribe",
  authors: [{ name: "Integra Consulting" }],
  keywords: [
    "AI scribe",
    "ambient AI",
    "SOAP note",
    "optometry",
    "HIPAA",
    "clinical documentation",
    "Optomate",
  ],
  openGraph: {
    title: "AI Smart Scribe — The Clinical Scribe that Really Listens",
    description:
      "Ambient AI scribe for independent optometry and medical practices. HIPAA compliant cloud or on-premise.",
    url: "https://aismartscribe.com",
    siteName: "AI Smart Scribe",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Smart Scribe — The Clinical Scribe that Really Listens",
    description:
      "Ambient AI scribe for independent optometry practices. Real-time SOAP notes. HIPAA compliant.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
        <body>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#00342b",
                color: "#ffffff",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.875rem",
                padding: "12px 20px",
                borderRadius: "9999px",
              },
              success: {
                iconTheme: { primary: "#14b8a6", secondary: "#00342b" },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
