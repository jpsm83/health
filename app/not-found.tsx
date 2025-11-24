import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import Navigation from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function NotFound() {
  // Detect locale from Accept-Language header, fallback to default
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  let locale = routing.defaultLocale;
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang: string) => lang.split(";")[0].trim().substring(0, 2))
      .filter((lang: string) =>
        routing.locales.includes(lang as (typeof routing.locales)[number])
      );

    if (languages.length > 0) {
      locale = languages[0] as typeof routing.defaultLocale;
    }
  }

  // Get messages for detected locale
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col items-center justify-center my-8 md:my-16 mx-3">
          {/* Full-screen centered content */}
          <div className="relative w-full h-[60vh] min-h-[360px] md:h-screen">
            <div className="absolute inset-0">
              <Image
                src="https://res.cloudinary.com/jpsm83/image/upload/v1760168603/health/bszqgxauhdetbqrpdzw8.jpg"
                alt="404 Not Found"
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Centered Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white max-w-4xl mx-auto px-6">
                {/* App Logo */}
                <div className="flex items-center justify-center space-x-2 mb-8 md:mb-16">
                  <Heart size={64} className="text-white" />
                  <span className="text-2xl md:text-6xl font-bold text-white">
                    Women&apos;s Spot
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6">404</h1>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-200">
                  Page Not Found!
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                  The page you&apos;re looking for doesn&apos;t exist or has
                  been moved.
                </p>

                {/* Single Action Button with App Colors */}
                <Button
                  asChild
                  variant="customDefault"
                  className="max-w-xs mx-auto"
                >
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
