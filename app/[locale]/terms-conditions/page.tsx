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
    '/terms-conditions',
    'metadata.termsConditions.title'
  );
}

// Server Component - handles metadata generation and renders static content
export default async function TermsConditionsPage() {
  const t = await getTranslations('termsConditions');

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"TermsConditions component"}>
        <div className="max-w-4xl mx-auto px-4 py-8 text-justify">
          <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
          
          <div className="mb-8">
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">{t("termsOfUse.title")}</h2>
              <p className="mb-4">{t("termsOfUse.description")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>{t("termsOfUse.definitions.0.term")}</strong> {t("termsOfUse.definitions.0.definition")}
                </li>
                <li>
                  <strong>{t("termsOfUse.definitions.1.term")}</strong> {t("termsOfUse.definitions.1.definition")}
                </li>
                <li>
                  <strong>{t("termsOfUse.definitions.2.term")}</strong> {t("termsOfUse.definitions.2.definition")}
                </li>
                <li>
                  <strong>{t("termsOfUse.definitions.3.term")}</strong> {t("termsOfUse.definitions.3.definition")}
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.introduction.title")}</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>{t("sections.introduction.items.0")}</li>
                <li>{t("sections.introduction.items.1")}</li>
                <li>{t("sections.introduction.items.2")}</li>
                <li>{t("sections.introduction.items.3")}</li>
                <li>{t("sections.introduction.items.4")}</li>
                <li>{t("sections.introduction.items.5")}</li>
                <li>{t("sections.introduction.items.6")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.useOfSites.title")}</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>{t("sections.useOfSites.items.0")}</li>
                <li>{t("sections.useOfSites.items.1")}</li>
                <li>{t("sections.useOfSites.items.2")}</li>
                <li>{t("sections.useOfSites.items.3")}</li>
                <li>{t("sections.useOfSites.items.4")}</li>
                <li>{t("sections.useOfSites.items.5")}</li>
                <li>{t("sections.useOfSites.items.6")}</li>
                <li>{t("sections.useOfSites.items.7")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.ageLimit.title")}</h2>
              <p>{t("sections.ageLimit.description")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.useOfDiscussionForums.title")}</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>{t("sections.useOfDiscussionForums.items.0")}</li>
                <li>{t("sections.useOfDiscussionForums.items.1")}</li>
                <li>{t("sections.useOfDiscussionForums.items.2")}</li>
                <li>{t("sections.useOfDiscussionForums.items.3")}</li>
                <li>{t("sections.useOfDiscussionForums.items.4")}</li>
                <li>{t("sections.useOfDiscussionForums.items.5")}</li>
                <li>{t("sections.useOfDiscussionForums.items.6")}</li>
                <li>{t("sections.useOfDiscussionForums.items.7")}</li>
                <li>{t("sections.useOfDiscussionForums.items.8")}</li>
                <li>{t("sections.useOfDiscussionForums.items.9")}</li>
                <li>{t("sections.useOfDiscussionForums.items.10")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.useOfMaterialPosted.title")}</h2>
              <p className="mb-4">{t("sections.useOfMaterialPosted.description")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.privacy.title")}</h2>
              <p>{t("sections.privacy.description")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.safety.title")}</h2>
              <p>{t("sections.safety.description")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.informationAndAvailability.title")}</h2>
              <p className="mb-4">{t("sections.informationAndAvailability.items.0")}</p>
              <p>{t("sections.informationAndAvailability.items.1")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.links.title")}</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>{t("sections.links.items.0")}</li>
                <li>{t("sections.links.items.1")}</li>
                <li>{t("sections.links.items.2")}</li>
                <li>{t("sections.links.items.3")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("sections.general.title")}</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>{t("sections.general.items.0")}</li>
                <li>{t("sections.general.items.1")}</li>
                <li>{t("sections.general.items.2")}</li>
                <li>{t("sections.general.items.3")}</li>
                <li>{t("sections.general.items.4")}</li>
                <li>{t("sections.general.items.5")}</li>
                <li>{t("sections.general.items.6")}</li>
              </ol>
            </section>

            <div className="bg-red-200 border-red-800 border-2 p-4 rounded-lg mt-8">
              <p className="text-red-800 font-semibold text-center">
                {t("warning.message")}
              </p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </main>
  );
}
