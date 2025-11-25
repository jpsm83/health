import { getTranslations } from "next-intl/server";
import confirmNewsletterSubscriptionAction, {
  NewsletterConfirmResult,
} from "@/app/actions/subscribers/confirmNewsletterSubscription";
import ConfirmNewsletterUI from "@/components/ConfirmNewsletterUI";

interface ConfirmNewsletterSectionProps {
  locale: string;
  token?: string;
  email?: string;
}

export default async function ConfirmNewsletterSection({
  locale,
  token,
  email,
}: ConfirmNewsletterSectionProps) {
  const t = await getTranslations({ locale, namespace: "newsletterConfirmation" });

  // Handle missing token or email
  if (!token || !email) {
    const errorResult: NewsletterConfirmResult = {
      success: false,
      message: t("errorMessage"),
      error: "MISSING_PARAMETERS",
    };

    return (
      <ConfirmNewsletterUI
        result={errorResult}
        initialStatus="error"
        translations={{
          confirming: t("confirming"),
          success: t("success"),
          error: t("error"),
          welcomeMessage: t("welcomeMessage"),
          errorMessage: t("errorMessage"),
          processingMessage: t("processingMessage"),
        }}
      />
    );
  }

  try {
    // Call server action to confirm subscription
    const result = await confirmNewsletterSubscriptionAction(token, email);

    // Determine initial status based on result
    const initialStatus: "loading" | "success" | "error" = result.success
      ? "success"
      : "error";

    return (
      <ConfirmNewsletterUI
        result={result}
        initialStatus={initialStatus}
        translations={{
          confirming: t("confirming"),
          success: t("success"),
          error: t("error"),
          welcomeMessage: t("welcomeMessage"),
          errorMessage: t("errorMessage"),
          processingMessage: t("processingMessage"),
        }}
      />
    );
  } catch (error) {
    console.error("Error confirming newsletter subscription:", error);
    
    const errorResult: NewsletterConfirmResult = {
      success: false,
      message: t("errorMessage"),
      error: "CONFIRMATION_FAILED",
    };

    return (
      <ConfirmNewsletterUI
        result={errorResult}
        initialStatus="error"
        translations={{
          confirming: t("confirming"),
          success: t("success"),
          error: t("error"),
          welcomeMessage: t("welcomeMessage"),
          errorMessage: t("errorMessage"),
          processingMessage: t("processingMessage"),
        }}
      />
    );
  }
}

