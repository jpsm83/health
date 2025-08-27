import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function NewsletterSignup() {
  const [emailInput, setEmailInput] = useState<string>("");

  const t = useTranslations("newsletterSignup");
  const locale = useLocale();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(emailInput);
  };

  return (
    <section className="bg-gradient-to-r from-red-600 to-pink-600 p-8 md:p-12 text-center text-white">
      <div className="max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <Mail size={60} />
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold mb-4">
          Stay Updated with Health Insights
        </h2>
        <p className="text-red-100 text-lg mb-8">
          Get the latest women&apos;s health tips, wellness advice, and expert
          insights delivered directly to your inbox.
        </p>

        {/* Newsletter Form */}
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-1 focus:ring-red-300 focus:ring-offset-0"
            required
          />
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="secondary"
            className="px-6 py-3 bg-white text-red-600 hover:bg-red-100 border-0 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            Subscribe
          </Button>
        </form>

        {/* Privacy Note */}
        <p className="text-red-200 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
