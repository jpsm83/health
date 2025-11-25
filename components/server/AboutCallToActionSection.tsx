import { getTranslations } from "next-intl/server";
import AboutCallToActionUI from "@/components/AboutCallToActionUI";

interface AboutCallToActionSectionProps {
  locale: string;
}

export default async function AboutCallToActionSection({
  locale,
}: AboutCallToActionSectionProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <AboutCallToActionUI
      locale={locale}
      translations={{
        title: t("callToAction.title"),
        description: t("callToAction.description"),
        button: t("callToAction.button"),
      }}
    />
  );
}

