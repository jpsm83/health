"use client";

import { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface Category {
  key: string;
  icon: LucideIcon;
}

interface AboutCategoriesUIProps {
  categories: Category[];
  locale: string;
}

export default function AboutCategoriesUI({
  categories,
  locale,
}: AboutCategoriesUIProps) {
  const t = useTranslations("about");

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <div
            key={category.key}
            className="text-center p-6 bg-purple-50 rounded-lg shadow-md"
          >
            <div className="w-16 h-16 bg-gradient-left-right rounded-full flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t(`whatWeCover.${category.key}.title`)}
            </h3>
            <p className="text-gray-700">
              {t(`whatWeCover.${category.key}.description`)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

