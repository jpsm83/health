"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { User, BookOpen, Lock, CheckCircle, XCircle } from "lucide-react";
import { mainCategories, newsletterFrequencies } from "@/lib/constants";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { updateUserProfile } from "@/app/actions/user/updateUserProfile";
import requestEmailConfirmation from "@/app/actions/auth/requestEmailConfirmation";
import { ISerializedUser } from "@/interfaces/user";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routing } from "@/i18n/routing";

// Import country flag components
import {
  US,
  BR,
  ES,
  FR,
  DE,
  IT,
  NL,
  IL,
  RU,
} from "country-flag-icons/react/1x1";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface FormData {
  username: string;
  email: string;
  role: string;
  birthDate: string;
  preferences: {
    language: string;
    region: string;
  };
  subscriptionPreferences: {
    categories: string[];
    subscriptionFrequencies: string;
  };
  imageFile?: File;
}

interface ProfileProps {
  initialUser?: ISerializedUser;
}

export default function Profile({ initialUser }: ProfileProps) {
  const t = useTranslations("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailConfirmationError, setEmailConfirmationError] = useState("");
  const [emailConfirmationSuccess, setEmailConfirmationSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalValues, setOriginalValues] = useState<FormData | null>(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const isInitialized = useRef(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Use initial user data from server or fallback to hook
  const [user, setUser] = useState<ISerializedUser | null>(initialUser || null);

  // Handle language change - immediate language switch like Navbar
  const handleLanguageChange = (newLanguage: string) => {
    // Map language codes to region codes
    const languageToRegion: Record<string, string> = {
      en: "US",
      pt: "BR", 
      es: "ES",
      fr: "FR",
      de: "DE",
      it: "IT",
      nl: "NL",
      he: "IL",
      ru: "RU",
    };

    const newRegion = languageToRegion[newLanguage] || "US";
    
    // Update form fields to track the new language
    setValue("preferences.language", newLanguage);
    setValue("preferences.region", newRegion);
    
    // Get current path without language prefix
    const pathWithoutLang = pathname?.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "") || "";
    const newPath = `/${newLanguage}${pathWithoutLang || ""}`;

    // Use replace to avoid adding to browser history and ensure proper refresh
    router.replace(newPath);
  };

  // Get language display name
  const getLanguageDisplayName = (lang: string): string => {
    const displayNames: Record<string, string> = {
      en: "English",
      pt: "Português",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      it: "Italiano",
      nl: "Nederlands",
      he: "עברית",
      ru: "Русский",
    };

    return displayNames[lang] || lang;
  };

  // Get country flag component
  const getCountryFlag = (lang: string, size: string) => {
    const flagMap: Record<
      string,
      React.ComponentType<{ title?: string; className?: string }>
    > = {
      en: US,
      pt: BR,
      es: ES,
      fr: FR,
      de: DE,
      it: IT,
      nl: NL,
      he: IL,
      ru: RU,
    };

    const FlagComponent = flagMap[lang];
    const languageName = getLanguageDisplayName(lang);

    if (size === "sm") {
      return <FlagComponent title={languageName} className="!w-4 !h-4 rounded-full" />;
    }

    if (size === "md") {
      return <FlagComponent title={languageName} className="!w-8 !h-8 rounded-full" />;
    }

    if (size === "lg") {
      return <FlagComponent title={languageName} className="!w-12 !h-12 rounded-full" />;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      role: "",
      birthDate: "",
      preferences: {
        language: "en",
        region: "US",
      },
      subscriptionPreferences: {
        categories: [],
        subscriptionFrequencies: "weekly",
      },
    },
    resolver: (values) => {
      const errors: {
        username?: { message: string };
        birthDate?: { message: string };
        subscriptionPreferences?: {
          categories?: { message: string };
          subscriptionFrequencies?: { message: string };
        };
      } = {};

      // Username validation
      if (!values.username) {
        errors.username = { message: t("validation.usernameRequired") };
      } else if (values.username.length < 5) {
        errors.username = { message: t("validation.usernameTooShort") };
      } else if (values.username.length > 30) {
        errors.username = { message: t("validation.usernameTooLong") };
      } else if (!/^[a-zA-Z0-9_\-\s]+$/.test(values.username)) {
        errors.username = {
          message: t("validation.usernameInvalidChars"),
        };
      }

      // Birth date validation
      if (!values.birthDate) {
        errors.birthDate = { message: t("validation.birthDateRequired") };
      }

      // Newsletter frequency validation
      if (!values.subscriptionPreferences?.subscriptionFrequencies) {
        errors.subscriptionPreferences = {
          subscriptionFrequencies: {
            message: t("validation.newsletterFrequencyRequired"),
          },
        };
      }

      return {
        values,
        errors: Object.keys(errors).length > 0 ? errors : {},
      };
    },
  });

  const watchedValues = watch();

  // Load user data and set form values when user data changes
  useEffect(() => {
    if (session?.user && user && !isInitialized.current) {
      isInitialized.current = true;

      const initialValues: FormData = {
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        preferences: {
          language: user.preferences?.language || locale || "en",
          region: user.preferences?.region || "US",
        },
        subscriptionPreferences: {
          categories:
            user.subscriptionPreferences?.categories || [],
          subscriptionFrequencies:
            user.subscriptionPreferences?.subscriptionFrequencies || "weekly",
        },
        // Don't include password fields in initial values
      };

      setOriginalValues(initialValues);

      // Set form values
      Object.entries(initialValues).forEach(([key, value]) => {
        if (key !== "imageFile") {
          if (key === "preferences") {
            // For preferences, use current locale instead of database value
            setValue("preferences", {
              language: locale || "en",
              region: (value as { language: string; region: string }).region,
            });
          } else {
            setValue(key as keyof FormData, value);
          }
        }
      });

      // Mark user data as loaded
      setIsUserDataLoaded(true);
    }
  }, [user, setValue, session?.user, locale]);

  // Update user state when initialUser prop changes
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  // Reset form when user data changes (for cases where user data is updated externally)
  useEffect(() => {
    if (user && isInitialized.current) {
      const updatedValues: FormData = {
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        preferences: {
          language: user.preferences?.language || locale || "en",
          region: user.preferences?.region || "US",
        },
        subscriptionPreferences: {
          categories:
            user.subscriptionPreferences?.categories || [],
          subscriptionFrequencies:
            user.subscriptionPreferences?.subscriptionFrequencies || "weekly",
        },
      };

      setOriginalValues(updatedValues);

      // Update form values
      Object.entries(updatedValues).forEach(([key, value]) => {
        if (key !== "imageFile") {
          if (key === "preferences") {
            // For preferences, use current locale instead of database value
            setValue("preferences", {
              language: locale || "en",
              region: (value as { language: string; region: string }).region,
            });
          } else {
            setValue(key as keyof FormData, value);
          }
        }
      });
    }
  }, [user, setValue, locale]);

  // Check for changes - use useMemo to prevent infinite loops
  const hasChanges = useMemo(() => {
    if (!originalValues) return false;

    const currentValues = {
      username: watchedValues.username,
      email: watchedValues.email,
      role: watchedValues.role,
      birthDate: watchedValues.birthDate,
      preferences: {
        language: watchedValues.preferences?.language || locale, // Use form value, fallback to locale
        region: watchedValues.preferences?.region,
      },
      subscriptionPreferences: watchedValues.subscriptionPreferences,
    };

    // Check if current locale differs from original database language
    const languageChanged = locale !== originalValues.preferences.language;
    
    return (
      JSON.stringify(currentValues) !== JSON.stringify(originalValues) ||
      selectedImage !== null ||
      languageChanged
    );
  }, [watchedValues, originalValues, selectedImage, locale]);


  // Simple auth check - redirect if not authenticated
  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      router.push(`/${locale}/signin`);
    }
  }, [status, session?.user, router, locale]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600"></div>
      </div>
    );
  }

  // Handle password reset
  const handleResetPassword = async () => {
    if (!user?.email) {
      setError(t("validation.userEmailNotFound"));
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await authService.requestPasswordReset(user.email);

      // Check if result is a string (success message) or has success property
      if (typeof result === "string") {
        // If result is a string, treat it as a success message
        setSuccess(result || t("passwordResetSent"));
      } else if (result && typeof result === "object") {
        // If result is an object, check for success property
        if ("success" in result) {
          if (result.success) {
            const successResult = result as {
              success: true;
              message: string;
              resetLink?: string;
            };
            setSuccess(successResult.message || t("passwordResetSent"));
          } else {
            const errorResult = result as { success: false; error: string };
            setError(errorResult.error || t("passwordResetFailed"));
          }
        } else {
          // If no success property but result exists, treat as success
          setSuccess(t("passwordResetSent"));
        }
      } else {
        // If result is falsy or unexpected format, treat as success (API worked)
        setSuccess(t("passwordResetSent"));
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email confirmation request
  const handleRequestEmailConfirmation = async () => {
    if (!user?.email) {
      setError(t("validation.userEmailNotFound"));
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Use server action instead of fetch
      const result = await requestEmailConfirmation(user.email);

      if (result.success) {
        setSuccess(result.message || "Email confirmation sent successfully!");
        setEmailConfirmationSuccess(
          result.message || "Email confirmation sent successfully!"
        );
      } else {
        setError(result.message || "Failed to send email confirmation");
        setEmailConfirmationError(
          result.message || "Failed to send email confirmation"
        );
      }
    } catch (error) {
      console.error("Email confirmation request error:", error);
      setError("Failed to request email confirmation");
    } finally {
      setIsLoading(false);
    }
  };


  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(t("validation.invalidImageType"));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(t("validation.imageTooLarge"));
        return;
      }

      setSelectedImage(file);
      setError(""); // Clear any previous errors

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("imageFile", undefined);
  };

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id || !session?.user?.email) {
      setError("User not authenticated");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const updateData = {
        username: data.username.trim(),
        email: data.email,
        role: data.role,
        birthDate: data.birthDate,
        preferences: {
          language: data.preferences.language, // Use form value to ensure consistency
          region: data.preferences.region,
        },
        subscriptionPreferences: {
          categories: data.subscriptionPreferences.categories,
          subscriptionFrequencies:
            data.subscriptionPreferences.subscriptionFrequencies,
        },
        subscriptionId: user?.subscriptionId, // Pass subscriptionId for subscription updates
        imageFile: selectedImage || undefined,
      };

      // Use server action directly - this works in client components!
      const result = await updateUserProfile(
        session.user.id,
        updateData,
        session.user.id
      );

      if (result?.success) {
        // Update local user state with the updated data
        if (result.data) {
          const updatedUser = Array.isArray(result.data) ? result.data[0] : result.data;
          setUser(updatedUser);
        }
        
        // Update original values after successful save
        setOriginalValues(data);
        setSelectedImage(null);
        setImagePreview(null);
        setError(""); // Clear any errors
        setSuccess(t("updateSuccess"));
      } else {
        setError(result?.message || t("updateFailed"));
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError(t("updateFailed") || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (fieldName: keyof FormData) => {
    // Clear field error when user starts typing
    if (errors[fieldName]) {
      clearErrors(fieldName);
    }
    // Clear general error when user starts typing in any field
    if (error) {
      setError("");
    }
  };

  // Show error state if user data failed to load
  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">
            {t("errors.loadingUserData")}
          </div>
          <div className="text-gray-600">User data not available</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Full Screen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600/50 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-6"></div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-center py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full space-y-6 md:space-y-8 md:bg-white p-4 md:p-8 md:rounded-lg md:shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image Section - Centered on mobile, left on desktop */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-pink-100">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile Preview"
                      priority
                      className="w-full h-full object-cover"
                    />
                  ) : user?.imageUrl ? (
                    <Image
                      width={128}
                      height={128}
                      src={user?.imageUrl}
                      alt="Profile"
                      priority
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <User className="w-12 h-12 md:w-16 md:h-16 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Image Upload Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                  <label htmlFor="image" className="cursor-pointer text-white">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      disabled={isLoading}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1">
                        <svg
                          className="w-full h-full"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-xs">
                        {t("actions.changeImage")}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Remove Image Button */}
              {selectedImage && (
                <Button
                  type="button"
                  onClick={removeImage}
                  className="mt-2 w-full text-center text-red-600 hover:text-red-900 text-sm bg-red-50 hover:bg-red-100 py-1 px-2 rounded-md transition-colors"
                >
                  {t("actions.remove")}
                </Button>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    {user?.username}
                  </h1>
                  <h3 className="text-sm md:text-md text-gray-400 mt-1">{user?.email}</h3>
                  <p className="text-sm md:text-lg text-gray-600 mt-2">{t("subtitle")}</p>
                </div>

                {/* Language Selector */}
                <div className="relative flex items-center space-x-2">
                  <h2 className="text-sm md:text-md text-gray-500">
                    {t("language.preferences")}
                  </h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                      >
                        {getCountryFlag(locale, "md")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[140px] bg-white shadow-lg"
                      align="end"
                      side="bottom"
                      sideOffset={4}
                    >
                      {routing.locales.map((lang) => (
                        <DropdownMenuItem
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className="cursor-pointer hover:bg-pink-50"
                        >
                          <div className="flex items-center space-x-2">
                            {getCountryFlag(lang, "sm")}
                            <span>{getLanguageDisplayName(lang)}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
                <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  {user?.emailVerified ? (
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs md:text-sm font-medium text-gray-900 truncate">
                      {user?.emailVerified
                        ? t("stats.verified")
                        : t("stats.unverified")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("stats.emailStatus")}
                    </div>
                  </div>
                </div>
                <div className="text-center p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-pink-600">
                    {user?.likedArticles?.length || 0}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {t("stats.likedArticles")}
                  </div>
                </div>
                <div className="text-center p-2 md:p-3 bg-gray-50 rounded-lg sm:col-span-2 md:col-span-1">
                  <div className="text-xl md:text-2xl font-bold text-pink-600">
                    {user?.commentedArticles?.length || 0}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {t("stats.comments")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Confirmation Request */}
          {!user?.emailVerified && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                onClick={handleRequestEmailConfirmation}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t("emailConfirmation.requestButton")}
              </Button>
              <p className="text-sm text-gray-500">
                {t("emailConfirmation.description")}
              </p>
            </div>
          )}

          {/* Success/Error Messages */}
          {emailConfirmationError && (
            <div className="rounded-md bg-pink-50 border border-pink-200 p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-pink-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-pink-800">
                    {t("messages.unexpectedErrorSendingEmailConfirmation")}
                  </h3>
                  <div className="mt-1 text-sm text-pink-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {emailConfirmationSuccess && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    {t("messages.successSendingEmailConfirmation")}
                  </h3>
                  <div className="mt-1 text-sm text-green-700">{success}</div>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 md:space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 mr-2 text-pink-600" />
                  {t("sections.personal")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("fields.username")}
                    </label>
                    <input
                      id="username"
                      type="text"
                      disabled={isLoading}
                      {...register("username")}
                      onChange={(e) => {
                        setValue("username", e.target.value);
                        handleInputChange("username");
                      }}
                      className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                        errors.username
                          ? "border-pink-500 focus:ring-pink-500 focus:border-pink-500"
                          : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                      } placeholder-gray-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder={t("fields.enterUsername")}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-pink-600">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("fields.birthDate")}
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      disabled={isLoading}
                      {...register("birthDate")}
                      onChange={(e) => {
                        setValue("birthDate", e.target.value);
                        handleInputChange("birthDate");
                      }}
                      className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                        errors.birthDate
                          ? "border-pink-500 focus:ring-pink-500 focus:border-pink-500"
                          : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                      } placeholder-gray-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errors.birthDate && (
                      <p className="mt-1 text-sm text-pink-600">
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Interests Section */}
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2 text-pink-600" />
                  {t("sections.categoryInterests")}
                </h2>

                {/* Newsletter Frequency Dropdown */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("fields.newsletterFrequency")}
                  </label>
                  <select
                    {...register(
                      "subscriptionPreferences.subscriptionFrequencies"
                    )}
                    onChange={(e) => {
                      setValue(
                        "subscriptionPreferences.subscriptionFrequencies",
                        e.target.value
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  >
                    {newsletterFrequencies.map((frequency) => (
                      <option key={frequency} value={frequency}>
                        {t(`frequencies.${frequency}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categories Grid - Show skeleton while loading, actual content when loaded */}
                <div className="mb-4 md:mb-6">
                  {!isUserDataLoaded ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-2 md:p-3 bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-20 flex-1" />
                            <Skeleton className="h-4 w-4 rounded flex-shrink-0 ml-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {mainCategories.map((category) => {
                        const isSelected =
                          watchedValues.subscriptionPreferences?.categories?.includes(
                            category
                          );
                        return (
                          <div
                            key={category}
                            className={`border rounded-lg p-2 md:p-3 transition-colors ${
                              isSelected
                                ? "border-green-900 border-2 bg-green-700/20 text-white"
                                : "border-red-700 border-2 bg-red-700/20 text-white"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 capitalize text-xs md:text-sm flex-1 min-w-0">
                                {t(`categories.${category}`)}
                              </h3>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentCategories =
                                    watchedValues.subscriptionPreferences
                                      ?.categories || [];
                                  let newCategories: string[];

                                  if (e.target.checked) {
                                    // Add category if not already present
                                    newCategories = [
                                      ...currentCategories,
                                      category,
                                    ];
                                  } else {
                                    // Remove category
                                    newCategories = currentCategories.filter(
                                      (cat) => cat !== category
                                    );
                                  }

                                  setValue(
                                    "subscriptionPreferences.categories",
                                    newCategories
                                  );
                                  // Trigger validation to update error state
                                  trigger("subscriptionPreferences.categories");
                                }}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded flex-shrink-0 ml-2"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              <div>
                {/* Security Section */}
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <Lock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-pink-600" />
                  {t("sections.security")}
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {t("actions.resetPassword")}
                    </Button>
                    <p className="text-sm text-gray-500">
                      {t("security.resetPasswordDescription")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Success/Error Messages */}
              {error && (
                <div className="rounded-md bg-pink-50 border border-pink-200 p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-pink-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-pink-800">
                        {t("messages.unexpectedError")}
                      </h3>
                      <div className="mt-1 text-sm text-pink-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 border border-green-200 p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-green-800">
                        {t("messages.success")}
                      </h3>
                      <div className="mt-1 text-sm text-green-700">
                        {success}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button - Inline with Security Section */}
              <div className="flex flex-col items-center md:items-end space-y-2">
                <Button
                  type="submit"
                  disabled={isLoading || !hasChanges}
                  className="group relative flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full md:w-auto"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {t("actions.save")}
                </Button>

                {/* Help text when save button is disabled */}
                {!hasChanges && !isLoading && (
                  <p className="text-sm text-gray-500 text-center md:text-right">
                    {t("messages.makeChangesToSave")}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
