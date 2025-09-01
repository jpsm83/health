import React from "react";
import { useTranslations } from "next-intl";

export default function CookiePolicy() {
  const t = useTranslations('cookiePolicy');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-justify">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <div className="mb-8">
        <p className="mb-4">
          {t("introduction.paragraph1")}
        </p>
        <p className="mb-4">
          {t("introduction.paragraph2")}
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.whatAreCookies.title")}
          </h2>
          <p className="mb-4">
            {t("sections.whatAreCookies.paragraphs.0")}
          </p>
          <p className="mb-4">
            {t("sections.whatAreCookies.paragraphs.1")}
          </p>
          <p className="mb-4">
            {t("sections.whatAreCookies.paragraphs.2")}
          </p>
          <p>
            {t("sections.whatAreCookies.paragraphs.3")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.whichCookies.title")}
          </h2>
          <p className="mb-4">
            {t("sections.whichCookies.description")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.yourChoices.title")}
          </h2>
          <p className="mb-4">
            {t("sections.yourChoices.paragraphs.0")}
          </p>
          <p className="mb-6">
            {t("sections.yourChoices.paragraphs.1")}
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                {t("sections.yourChoices.subsections.websiteOptOut.title")}
              </h3>
              <p className="mb-3">
                {t("sections.yourChoices.subsections.websiteOptOut.paragraphs.0")}
              </p>
              <p className="mb-3">
                {t("sections.yourChoices.subsections.websiteOptOut.paragraphs.1")}
              </p>
              <p>
                {t("sections.yourChoices.subsections.websiteOptOut.paragraphs.2")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                {t("sections.yourChoices.subsections.mobileAppOptOut.title")}
              </h3>
              <p className="mb-3">
                {t("sections.yourChoices.subsections.mobileAppOptOut.paragraphs.0")}
              </p>
              <p>
                {t("sections.yourChoices.subsections.mobileAppOptOut.paragraphs.1")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                {t("sections.yourChoices.subsections.moreInformation.title")}
              </h3>
              <p>
                {t("sections.yourChoices.subsections.moreInformation.description")}
                <a
                  href="https://www.allaboutcookies.org"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {t("sections.yourChoices.subsections.moreInformation.links.allaboutcookies")}
                </a>{" "}
                and
                <a
                  href="https://www.youronlinechoices.eu"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {t("sections.yourChoices.subsections.moreInformation.links.youronlinechoices")}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};