import { Metadata } from "next";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { mainCategories } from "@/lib/constants";
import { 
  Home, 
  User, 
  BookOpen, 
  Plus, 
  Mail, 
  Shield, 
  FileText,
  Globe,
  HelpCircle
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePublicMetadata(locale, "/site-map", "metadata.siteMap.title");
}

// Server Component - handles metadata generation and renders static content
export default async function SiteMapPage() {
  const t = await getTranslations("siteMap");
  return (
    <main className="container mx-auto px-4 py-8">
      <ErrorBoundary context={"SiteMap component"}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          {/* Main Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Home & Core Pages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.corePages.title")}
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.corePages.home")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.corePages.homeDescription")}</span>
                </li>
                <li>
                  <Link href="/about" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.corePages.about")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.corePages.aboutDescription")}</span>
                </li>
                <li>
                  <Link href="/search" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.corePages.search")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.corePages.searchDescription")}</span>
                </li>
              </ul>
            </div>

            {/* Article Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.articleCategories.title")}
              </h2>
              <ul className="space-y-3">
                {mainCategories.map((category) => (
                  <li key={category}>
                    <Link 
                      href={`/${category}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline capitalize"
                    >
                      {t(`sections.articleCategories.${category}`)}
                    </Link>
                    <span className="text-gray-500 text-sm ml-2">
                      - {t(`sections.articleCategories.${category}Description`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Account */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.userAccount.title")}
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/signin" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.userAccount.signIn")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.userAccount.signInDescription")}</span>
                </li>
                <li>
                  <Link href="/signup" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.userAccount.signUp")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.userAccount.signUpDescription")}</span>
                </li>
                <li>
                  <Link href="/profile" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.userAccount.profile")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.userAccount.profileDescription")}</span>
                </li>
                <li>
                  <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.userAccount.dashboard")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.userAccount.dashboardDescription")}</span>
                </li>
                <li>
                  <Link href="/favorites" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.userAccount.favorites")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.userAccount.favoritesDescription")}</span>
                </li>
              </ul>
            </div>

            {/* Content Creation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.contentCreation.title")}
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/create-article" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.contentCreation.createArticle")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.contentCreation.createArticleDescription")}</span>
                </li>
              </ul>
            </div>

            {/* Newsletter & Communication */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.newsletter.title")}
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/confirm-newsletter" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.newsletter.confirmNewsletter")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.newsletter.confirmNewsletterDescription")}</span>
                </li>
                <li>
                  <Link href="/unsubscribe" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.newsletter.unsubscribe")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.newsletter.unsubscribeDescription")}</span>
                </li>
              </ul>
            </div>

            {/* Security & Account Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.security.title")}
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.security.forgotPassword")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.security.forgotPasswordDescription")}</span>
                </li>
                <li>
                  <Link href="/reset-password" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.security.resetPassword")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.security.resetPasswordDescription")}</span>
                </li>
                <li>
                  <Link href="/confirm-email" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.security.confirmEmail")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.security.confirmEmailDescription")}</span>
                </li>
              </ul>
            </div>

            {/* Legal & Policies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.legal.title")}
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.legal.privacyPolicy")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.legal.privacyPolicyDescription")}</span>
                </li>
                <li>
                  <Link href="/terms-conditions" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.legal.termsConditions")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.legal.termsConditionsDescription")}</span>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.legal.cookiePolicy")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.legal.cookiePolicyDescription")}</span>
                </li>
              </ul>
            </div>

            {/* Language Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.languageSupport.title")}
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  {t("sections.languageSupport.description")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">{t("sections.languageSupport.english")}</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">{t("sections.languageSupport.portuguese")}</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">{t("sections.languageSupport.spanish")}</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">{t("sections.languageSupport.french")}</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">{t("sections.languageSupport.german")}</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">{t("sections.languageSupport.italian")}</span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-orange-600" />
                {t("sections.helpSupport.title")}
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/site-map" className="text-blue-600 hover:text-blue-800 hover:underline">
                    {t("sections.helpSupport.siteMap")}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- {t("sections.helpSupport.siteMapDescription")}</span>
                </li>
              </ul>
            </div>
          </div>


          {/* Footer Note */}
          <div className="text-center text-gray-500 text-sm">
            <p>
              {t("footer.description")}
            </p>
          </div>
        </div>
      </ErrorBoundary>
    </main>
  );
}
