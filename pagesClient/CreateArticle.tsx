"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

export default function CreateArticle() {
  const t = useTranslations("createArticle");

  const { data: session, status } = useSession();

  // Admin-only access check
  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user && session.user.role !== "admin")
    ) {
      window.location.href = "/";
    }
  }, [status, session?.user]);

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

      {/* Article Creation Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.title")}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="input-standard w-full focus:ring-blue-500 focus:border-transparent"
              placeholder={t("form.title")}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.content")}
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className="input-standard w-full focus:ring-blue-500 focus:border-transparent"
              placeholder={t("form.content")}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.category")}
            </label>
            <select
              id="category"
              name="category"
              className="input-standard w-full focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t("form.selectCategory")}</option>
              <option value="health">{t("form.categories.health")}</option>
              <option value="fitness">{t("form.categories.fitness")}</option>
              <option value="nutrition">
                {t("form.categories.nutrition")}
              </option>
              <option value="wellness">{t("form.categories.wellness")}</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.tags")}
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="input-standard w-full focus:ring-blue-500 focus:border-transparent"
              placeholder={t("form.tagsPlaceholder")}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t("form.submit")}
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t("form.cancel")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
