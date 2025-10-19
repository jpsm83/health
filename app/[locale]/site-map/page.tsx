import { Metadata } from "next";
import { generatePublicMetadata } from "@/lib/utils/genericMetadata";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useTranslations } from "next-intl";
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
export default function SiteMapPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <ErrorBoundary context={"SiteMap component"}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Site Map
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Navigate through all the pages and features available on Women's Spot. 
              Find everything from health articles to user management tools.
            </p>
          </div>

          {/* Main Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Home & Core Pages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-orange-600" />
                Core Pages
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Home
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Main landing page</span>
                </li>
                <li>
                  <Link href="/about" className="text-blue-600 hover:text-blue-800 hover:underline">
                    About Us
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Learn about our mission</span>
                </li>
                <li>
                  <Link href="/search" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Search Articles
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Find specific content</span>
                </li>
              </ul>
            </div>

            {/* Article Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
                Article Categories
              </h2>
              <ul className="space-y-3">
                {mainCategories.map((category) => (
                  <li key={category}>
                    <Link 
                      href={`/${category}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline capitalize"
                    >
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </Link>
                    <span className="text-gray-500 text-sm ml-2">
                      - {category === 'weightLoss' ? 'Weight Loss' : category} articles
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Account */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-600" />
                User Account
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/signin" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Sign In
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Access your account</span>
                </li>
                <li>
                  <Link href="/signup" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Sign Up
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Create new account</span>
                </li>
                <li>
                  <Link href="/profile" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Profile
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Manage your profile</span>
                </li>
                <li>
                  <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Dashboard
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Your personal dashboard</span>
                </li>
                <li>
                  <Link href="/favorites" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Favorites
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Saved articles</span>
                </li>
              </ul>
            </div>

            {/* Content Creation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-orange-600" />
                Content Creation
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/create-article" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Create Article
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Write new articles</span>
                </li>
              </ul>
            </div>

            {/* Newsletter & Communication */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-orange-600" />
                Newsletter & Communication
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/confirm-newsletter" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Confirm Newsletter
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Newsletter confirmation</span>
                </li>
                <li>
                  <Link href="/unsubscribe" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Unsubscribe
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Manage subscriptions</span>
                </li>
              </ul>
            </div>

            {/* Security & Account Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Security & Account
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Forgot Password
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Reset your password</span>
                </li>
                <li>
                  <Link href="/reset-password" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Reset Password
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Set new password</span>
                </li>
                <li>
                  <Link href="/confirm-email" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Confirm Email
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Verify email address</span>
                </li>
              </ul>
            </div>

            {/* Legal & Policies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Legal & Policies
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Privacy Policy
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Data protection information</span>
                </li>
                <li>
                  <Link href="/terms-conditions" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Terms & Conditions
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Terms of service</span>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Cookie Policy
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- Cookie usage information</span>
                </li>
              </ul>
            </div>

            {/* Language Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-orange-600" />
                Language Support
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  Available in multiple languages:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">English</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Português</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Español</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Français</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Deutsch</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Italiano</span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-orange-600" />
                Help & Support
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/site-map" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Site Map
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">- This page</span>
                </li>
              </ul>
            </div>
          </div>


          {/* Footer Note */}
          <div className="text-center text-gray-500 text-sm">
            <p>
              This site map shows all the pages and features available on Women's Spot. 
              Use the navigation menu at the top of any page to quickly access these sections.
            </p>
          </div>
        </div>
      </ErrorBoundary>
    </main>
  );
}
