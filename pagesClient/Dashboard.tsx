"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();

  const { data: session, status } = useSession();

  // Admin-only access check
  useEffect(() => {
    if (
      status !== "loading" &&
      (!session?.user?.id || session?.user?.role !== "admin")
    ) {
      router.push("/");
    }
  }, [status, session?.user?.id, session?.user?.role, router]);

  // Don't render if not admin
  if (!session?.user?.id || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-xl text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t("stats.articles")}
          </h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t("stats.goals")}
          </h3>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">📈</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t("stats.progress")}
          </h3>
          <p className="text-3xl font-bold text-purple-600">78%</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t("stats.streak")}
          </h3>
          <p className="text-3xl font-bold text-orange-600">12</p>
        </div>
      </div>

      {/* Language Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          {t("languageInfo.language")}: {locale.toUpperCase()}
        </p>
      </div>
    </>
  );
}
