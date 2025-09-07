import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/components/Toasts";
import { subscribeToNewsletter } from "@/app/actions/newsletterSubscription";

export default function NewsletterSignup() {
  const [emailInput, setEmailInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const t = useTranslations("newsletterSignup");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!emailInput.trim()) {
      showToast(
        "error",
        "Email Required",
        "Please enter your email address"
      );
      return;
    }

    // Validate email format with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      showToast(
        "error",
        "Invalid Email",
        "Please enter a valid email address"
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await subscribeToNewsletter(emailInput.trim());

      if (result.success) {
        showToast(
          "success",
          "Subscription Successful",
          result.message
        );
        setEmailInput(""); // Clear the input
      } else {
        showToast(
          "error",
          "Subscription Failed",
          result.message
        );
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      showToast(
        "error",
        "Subscription Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full md:w-2/3 mx-auto bg-gradient-to-r from-red-600 to-pink-600 p-8 md:p-12 text-center text-white shadow-xl">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <Mail size={60} />
      </div>

      {/* Content */}
      <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
      <p className="text-red-100 text-lg mb-8">{t("description")}</p>

      {/* Newsletter Form */}
      <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <Input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder={t("emailPlaceholder")}
          className="flex-1 bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-1 focus:ring-red-300 focus:ring-offset-0"
          required
        />
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="secondary"
          disabled={isLoading}
          className="px-6 py-3 bg-white text-red-600 hover:bg-red-100 border-0 font-semibold shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Subscribing..." : t("subscribeButton")}
        </Button>
      </form>

      {/* Privacy Note */}
      <p className="text-red-200 text-sm mt-4">{t("privacyNote")}</p>
    </section>
  );
}
