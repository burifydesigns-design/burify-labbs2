import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://burifylabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Burify Labs | Web Design + AI Automation Agency",
    template: "%s | Burify Labs",
  },
  description: "We design exceptional digital experiences and build intelligent automation systems that drive growth. Premium web design and AI automation solutions.",
  keywords: [
    "web design",
    "AI automation",
    "digital agency",
    "creative studio",
    "brand identity",
    "e-commerce",
    "mobile app development",
  ],
  authors: [{ name: "Burify Labs" }],
  creator: "Burify Labs",
  publisher: "Burify Labs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Burify Labs",
    title: "Burify Labs | Web Design + AI Automation Agency",
    description: "We design exceptional digital experiences and build intelligent automation systems that drive growth.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Burify Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burify Labs | Web Design + AI Automation Agency",
    description: "We design exceptional digital experiences and build intelligent automation systems that drive growth.",
    images: ["/images/og-image.png"],
    creator: "@burifylabs",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6B5FA9" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1625" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased bg-background text-text-primary">
        {children}
      </body>
    </html>
  );
}
