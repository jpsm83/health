import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
// import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="min-h-screen bg-[#f9fafb]">
        <SessionProvider basePath="/api/v1/auth">
          {children}
          <Toaster />
        </SessionProvider>
        {/* Temporarily disabled service worker for debugging */}
        {/* <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
              }
            `,
          }}
        /> */}
      </body>
    </html>
  );
}
