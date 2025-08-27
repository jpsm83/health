import "./globals.css";
import { SessionProvider } from "next-auth/react";

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
        </SessionProvider>
      </body>
    </html>
  );
}
