import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import "./growth.css";

type RootLayoutProps = Readonly<{ children: ReactNode }>;
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://burifylabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: "Burify | Patient Growth Systems, Websites & Automation", template: "%s | Burify" },
  description: "Burify helps dental and private healthcare practices improve digital visibility, patient enquiry journeys, websites and responsible workflow automation.",
  keywords: ["patient growth systems", "dental website design", "dental marketing technology", "healthcare website design", "local SEO", "workflow automation", "conversion-focused websites"],
  authors: [{ name: "Burify" }],
  creator: "Burify",
  publisher: "Burify",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", locale: "en_US", url: baseUrl, siteName: "Burify", title: "Burify | Patient Growth Systems, Websites & Automation", description: "Websites, local search, enquiry journeys and responsible automation for dental and private healthcare practices.", images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Burify — Patient Growth Systems", type: "image/png" }] },
  twitter: { card: "summary_large_image", title: "Burify | Patient Growth Systems", description: "Websites, local search, enquiry journeys and responsible automation for healthcare practices.", images: ["/images/og-image.png"] },
  alternates: { canonical: baseUrl },
  icons: { icon: "/images/logo/logo.jpeg", apple: "/images/logo/logo.jpeg" },
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F7F6F1" }, { media: "(prefers-color-scheme: dark)", color: "#292A26" }], width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: RootLayoutProps) {
  return <html lang="en"><head><Script src="https://analytics.ahrefs.com/analytics.js" data-key="xzCYmIFQHk/XOzrkQmdeLw" strategy="afterInteractive" async /></head><body className="font-sans antialiased bg-background text-text-primary"><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">Skip to main content</a>{children}<Analytics /><SpeedInsights /></body></html>;
}
