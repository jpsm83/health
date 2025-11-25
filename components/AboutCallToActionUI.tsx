"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AboutCallToActionUIProps {
  locale: string;
  translations: {
    title: string;
    description: string;
    button: string;
  };
}

export default function AboutCallToActionUI({
  locale,
  translations,
}: AboutCallToActionUIProps) {
  return (
    <div className="text-center bg-gradient-left-right py-24 px-12">
      <h2 className="text-3xl font-bold text-white mb-4">
        {translations.title}
      </h2>
      <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
        {translations.description}
      </p>
      <Button variant="customSecondary" className="w-1/2 mx-auto">
        <Link href={`/${locale}`}>{translations.button}</Link>
      </Button>
    </div>
  );
}

