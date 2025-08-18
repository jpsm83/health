import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health App",
  description: "Your comprehensive health and wellness platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
