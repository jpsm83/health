"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import passwordValidation from "@/lib/utils/passwordValidation";
import { useSession, signIn } from "next-auth/react";
import { createUser } from "@/app/actions/user/createUser";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  imageFile?: File;
}

// 68a71808bf9d6c63772b49db

export default function SignUp() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("SignUp");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<FormData>({
    mode: "onChange",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      // Redirect based on user role
      if (session?.user?.role === "admin") {
        router.push(`/${locale}/dashboard`);
      } else {
        router.push(`/${locale}/profile`);
      }
    }
  }, [status, session?.user?.role, router, locale]);

  const password = watch("password");

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
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
    setError("");
    setIsLoading(true);

    try {
      // Get browser language and region
      const browserLanguage = navigator.language || "en";
      const browserRegion = navigator.language.split("-")[1] || "US";

      // Use the createUser server action
      const result = await createUser({
        username: data.username.trim(),
        email: data.email,
        password: data.password,
        role: "user",
        birthDate: data.birthDate,
        language: browserLanguage,
        region: browserRegion,
        imageFile: selectedImage || undefined,
      });

      if (result.success) {
        // After successful registration, automatically sign in the user with NextAuth
        try {
          await signIn("credentials", {
            email: data.email,
            password: data.password,
            callbackUrl: "/", // Redirect to root after successful login
            redirect: true, // Must be true for OAuth flows
          });
        } catch (signInError) {
          console.error("Login error after registration:", signInError);
          setError(
            "Registration successful but login failed. Please sign in manually."
          );
          setIsLoading(false);
        }
      } else {
        setError(result.message || "Registration failed");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("google", { callbackUrl: "/" });

      if ((result as unknown as { error?: string })?.error) {
        console.error(
          "Google sign-in error:",
          (result as unknown as { error?: string })?.error
        );
        setError(t("googleSignInFailed"));
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(t("googleSignInFailed"));
      setIsLoading(false);
    }
  };

  const handleInputChange = (fieldName: keyof FormData) => {
    // Clear field error when user starts typing
    if (errors[fieldName]) {
      clearErrors(fieldName);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
        <div>
          <h2
            className="mt-6 text-center text-3xl font-extrabold text-white"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
            }}
          >
            {t("createAccount")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("alreadyHaveAccount")}{" "}
            <Link href={`/${locale}/signin`} className="main-link">
              {t("signIn")}
            </Link>
          </p>
        </div>

        {/* Google Signup Button */}
        <div className="mt-6">
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignUp}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-2 focus:border-purple-400"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? t("signingUpWithGoogle") : t("signUpWithGoogle")}
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center">
          <span className="w-full border-t border-gray-300" />
          <span className="bg-white text-gray-500 px-2">{t("or")}</span>
          <span className="w-full border-t border-gray-300" />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-orange-50 p-4">
              <div className="text-sm text-orange-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("username")}
              </label>
              <Input
                id="username"
                type="text"
                disabled={isLoading}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 5,
                    message: "Username must be at least 5 characters",
                  },
                  maxLength: {
                    value: 30,
                    message: "Username cannot exceed 30 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_\-\s]+$/,
                    message:
                      "Username can only contain letters, numbers, underscores, dashes and spaces",
                  },
                })}
                onChange={(e) => {
                  setValue("username", e.target.value);
                  handleInputChange("username");
                }}
                className={errors.username ? "input-error" : "input-standard"}
                placeholder={t("enterUsername")}
              />
              {errors.username && (
                <p className="input-error">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("emailAddress")}
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                onChange={(e) => {
                  setValue("email", e.target.value);
                  handleInputChange("email");
                }}
                className={errors.email ? "input-error" : "input-standard"}
                placeholder={t("enterEmail")}
              />
              {errors.email && (
                <p className="input-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("birthDate")}
              </label>
              <Input
                id="birthDate"
                type="date"
                disabled={isLoading}
                {...register("birthDate", {
                  required: "Birth date is required",
                })}
                onChange={(e) => {
                  setValue("birthDate", e.target.value);
                  handleInputChange("birthDate");
                }}
                className={errors.birthDate ? "input-error" : "input-standard"}
              />
              {errors.birthDate && (
                <p className="input-error">{errors.birthDate.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("password")}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("password", {
                    required: "Password is required",
                    validate: (value: string) => {
                      if (!passwordValidation(value)) {
                        return "Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol, and be at least 6 characters long";
                      }
                      return true;
                    },
                  })}
                  onChange={(e) => {
                    setValue("password", e.target.value);
                    handleInputChange("password");
                  }}
                  className={errors.password ? "input-error" : "input-standard"}
                  placeholder={t("enterPassword")}
                />
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="input-error">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value: string) =>
                      value === password || "Passwords do not match",
                  })}
                  onChange={(e) => {
                    setValue("confirmPassword", e.target.value);
                    handleInputChange("confirmPassword");
                  }}
                  className={
                    errors.confirmPassword ? "input-error" : "input-standard"
                  }
                  placeholder={t("confirmPassword")}
                />
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="input-error">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("profileImage")}
              </label>
              <div className="flex items-center">
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  disabled={isLoading}
                  {...register("imageFile")}
                  onChange={handleImageChange}
                  className="input-standard file:mr-2 file:py-1 file:px-4 file:rounded-md file:border-1 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-50"
                />
                {selectedImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-500 text-sm ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {errors.imageFile && (
                <p className="input-error">{errors.imageFile.message}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="max-w-xs h-auto rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="customDefault"
            className="mt-6"
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
            {t("createAccount")}
          </Button>
        </form>

        <div className="text-center">
          <Link
            href={`/${locale}`}
            className={`main-link ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
