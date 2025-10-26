import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Women's Spot - Empowering Women's Health & Wellness",
    template: "%s | Women's Spot",
  },
  description:
    "Discover valuable health insights and wellness tips specifically designed for women. Expert advice on nutrition, fitness, mental health, and lifestyle.",
  keywords: [
    "health",
    "women",
    "wellness",
    "fitness",
    "nutrition",
    "mental health",
    "lifestyle",
  ],
  authors: [{ name: "Women's Spot Team" }],
  creator: "Women's Spot Team",
  publisher: "Women's Spot",
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://womensspot.com"
  ),
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    type: "website",
    locale: "en_US",
    url:
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://womensspot.com",
    siteName: "Women's Spot",
    title: "Women's Spot - Empowering Women's Health & Wellness",
    description:
      "Discover valuable health insights and wellness tips specifically designed for women. Expert advice on nutrition, fitness, mental health, and lifestyle.",
    images: [
      {
        url: "/womens-spot-logo.png",
        width: 630,
        height: 630,
        alt: "Women's Spot - Empowering Women's Health & Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", // Required: Card type
    site: "@womensspot", // Required: Website Twitter handle
    creator: "@womensspot", // Required: Content creator Twitter handle
    title: "Women's Spot - Empowering Women's Health & Wellness", // Required: Title (max 70 chars)
    description:
      "Discover valuable health insights and wellness tips specifically designed for women.", // Required: Description (max 200 chars)
    images: ["/womens-spot-logo.png"], // Required: Image URLs
    // Note: image and imageAlt are handled via additional metadata
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/womens-spot-logo.png", sizes: "any", type: "image/png" },
    ],
    apple: [
      { url: "/womens-spot-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Women's Spot",
  },
  other: {
    "msapplication-TileColor": "#8B5CF6",
    "theme-color": "#8B5CF6",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>{/* Next.js will automatically inject metadata here */}</head>
      <body className="min-h-screen bg-[#f9fafb]">
        <SessionProvider basePath="/api/v1/auth">
          {children}
          <Toaster />
        </SessionProvider>

        {/* Initialize globals */}
        <Script
          id="ezoic-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              window.ezstandalone.cmd = window.ezstandalone.cmd || [];
              window._ezaq = window._ezaq || [];
            `,
          }}
        />

        {/* Privacy script */}
        <Script
          id="ezoic-privacy"
          strategy="afterInteractive"
          src="https://cmp.gatekeeperconsent.com/min.js"
        />

        {/* Main Ezoic header script */}
        <Script
          id="ezoic-header"
          strategy="afterInteractive"
          src="https://www.ezojs.com/ezoic/sa.min.js"
        />

        {/* CookieYes Banner */}
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/51a7b20bfcdfbe3a78df8a60/script.js"
          strategy="beforeInteractive"
        />

        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
