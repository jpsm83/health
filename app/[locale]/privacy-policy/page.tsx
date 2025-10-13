import { generatePublicMetadata } from '@/lib/utils/genericMetadata';
import { getTranslations } from 'next-intl/server';
import ErrorBoundary from '@/components/ErrorBoundary';

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;
   
  return generatePublicMetadata(
    locale,
    '/privacy-policy',
    'metadata.privacyPolicy.title'
  );
}

// Server Component - handles metadata generation and renders static content
export default async function PrivacyPolicyPage() {
  const t = await getTranslations("privacyPolicy");

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"PrivacyPolicy component"}>
        <div className="max-w-4xl mx-auto px-4 py-8 text-justify">
          <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-4">
              {t("lastUpdated")} {new Date().toLocaleDateString()}
            </p>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("highlights.title")}
              </h2>
              <p className="mb-4">
                {t("highlights.description")}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.whatInformationWeObtain.title")}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.whatInformationWeObtain.items.0")}</li>
                <li>{t("sections.whatInformationWeObtain.items.1")}</li>
                <li>{t("sections.whatInformationWeObtain.items.2")}</li>
                <li>{t("sections.whatInformationWeObtain.items.3")}</li>
                <li>{t("sections.whatInformationWeObtain.items.4")}</li>
                <li>{t("sections.whatInformationWeObtain.items.5")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.howWeUseInformation.title")}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.howWeUseInformation.items.0")}</li>
                <li>{t("sections.howWeUseInformation.items.1")}</li>
                <li>{t("sections.howWeUseInformation.items.2")}</li>
                <li>{t("sections.howWeUseInformation.items.3")}</li>
                <li>{t("sections.howWeUseInformation.items.4")}</li>
                <li>{t("sections.howWeUseInformation.items.5")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.howWeShareInformation.title")}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.howWeShareInformation.items.0")}</li>
                <li>{t("sections.howWeShareInformation.items.1")}</li>
                <li>{t("sections.howWeShareInformation.items.2")}</li>
                <li>{t("sections.howWeShareInformation.items.3")}</li>
                <li>{t("sections.howWeShareInformation.items.4")}</li>
                <li>{t("sections.howWeShareInformation.items.5")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.yourChoices.title")}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.yourChoices.items.0")}</li>
                <li>{t("sections.yourChoices.items.1")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.additionalInformation.title")}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.additionalInformation.items.0")}</li>
                <li>{t("sections.additionalInformation.items.1")}</li>
                <li>{t("sections.additionalInformation.items.2")}</li>
                <li>{t("sections.additionalInformation.items.3")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.howWeProtectAndStore.title")}
              </h2>
              <p className="mb-4">
                {t("sections.howWeProtectAndStore.description1")}
              </p>
              <p className="mb-4">
                {t("sections.howWeProtectAndStore.description2")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.howWeProtectAndStore.items.0")}</li>
                <li>{t("sections.howWeProtectAndStore.items.1")}</li>
                <li>{t("sections.howWeProtectAndStore.items.2")}</li>
                <li>{t("sections.howWeProtectAndStore.items.3")}</li>
                <li>{t("sections.howWeProtectAndStore.items.4")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.internationalDataTransfer.title")}
              </h2>
              <p className="mb-4">
                {t("sections.internationalDataTransfer.description1")}
              </p>
              <p>
                {t("sections.internationalDataTransfer.description2")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.childrensPrivacyRights.title")}
              </h2>
              <p>
                {t("sections.childrensPrivacyRights.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.linksToThirdParty.title")}
              </h2>
              <p className="mb-4">
                {t("sections.linksToThirdParty.description1")}
              </p>
              <p className="mb-4">
                {t("sections.linksToThirdParty.description2")}
              </p>
              <p>
                {t("sections.linksToThirdParty.description3")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {t("sections.changesToPrivacyNotice.title")}
              </h2>
              <p className="mb-4">
                {t("sections.changesToPrivacyNotice.description1")}
              </p>
              <p>
                {t("sections.changesToPrivacyNotice.description2")}
              </p>
            </section>
          </div>
        </div>
      </ErrorBoundary>
    </main>
  );
}
