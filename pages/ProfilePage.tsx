"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { User, BookOpen, Lock, CheckCircle, XCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { mainCategories, newsletterFrequencies } from "@/lib/constants";


interface FormData {
  username: string;
  email: string;
  role: string;
  birthDate: string;
  subscriptionPreferences: {
    categories: string[];
    subscriptionFrequencies: string;
  };
  imageFile?: File;
}

export default function ProfileContent() {
  const t = useTranslations("profile");
  const { forgotPassword } = useAuth();
  const {
    user,
    loading: userLoading,
    error: userError,
    updateProfile,
  } = useUser();

  // Handle password reset
  const handleResetPassword = async () => {
    if (!user?.email) {
      setError("User email not found");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await forgotPassword(user.email);

      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          const successResult = result as {
            success: true;
            message: string;
            resetLink?: string;
          };
          setSuccess(
            successResult.message || "Password reset email sent successfully"
          );
        } else {
          const errorResult = result as { success: false; error: string };
          setError(errorResult.error || "Failed to send reset email");
        }
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalValues, setOriginalValues] = useState<FormData | null>(null);
  const isInitialized = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const watchedValues = watch();

  // Load user data and set form values when user data changes
  useEffect(() => {
    if (user && !isInitialized.current) {
      isInitialized.current = true;
      
      const initialValues: FormData = {
        username: user.username,
        email: user.email,
        role: user.role,
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        subscriptionPreferences: {
          categories: user.subscriptionPreferences?.categories || mainCategories,
          subscriptionFrequencies: user.subscriptionPreferences?.subscriptionFrequencies || "weekly",
        },
        // Don't include password fields in initial values
      };

      setOriginalValues(initialValues);

      // Set form values
      Object.entries(initialValues).forEach(([key, value]) => {
        if (key !== "imageFile") {
          setValue(key as keyof FormData, value);
        }
      });
    }
  }, [user, setValue]);

  // Check for changes - use useMemo to prevent infinite loops
  const hasChanges = useMemo(() => {
    if (!originalValues) return false;
    
    const currentValues = {
      username: watchedValues.username,
      email: watchedValues.email,
      role: watchedValues.role,
      birthDate: watchedValues.birthDate,
      subscriptionPreferences: watchedValues.subscriptionPreferences,
    };

    return (
      JSON.stringify(currentValues) !== JSON.stringify(originalValues) ||
      selectedImage !== null
    );
  }, [watchedValues, originalValues, selectedImage]);

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
      const updateData = {
        username: data.username,
        email: data.email,
        role: data.role,
        birthDate: data.birthDate,
        subscriptionPreferences: {
          categories: data.subscriptionPreferences.categories.filter(cat => 
            data.subscriptionPreferences.categories.includes(cat)
          ),
          subscriptionFrequencies: data.subscriptionPreferences.subscriptionFrequencies,
        },
        imageFile: selectedImage || undefined,
      };

      const result = await updateProfile(updateData);

      if (result?.success) {
        // Update original values after successful save
        setOriginalValues(data);
        setSelectedImage(null);
        setImagePreview(null);
        setError(""); // Clear any errors
      } else {
        setError(result?.message || "Failed to update profile");
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

  // Show loading state while fetching user data
  if (userLoading || !user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600"></div>
      </div>
    );
  }

  // Show error state if user data failed to load
  if (userError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">
            Error loading user data
          </div>
          <div className="text-gray-600">{userError}</div>
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

      <div className="flex items-start justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
          <div className="flex items-start space-x-8">
            {/* Profile Image Section - Top Left */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-pink-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <User className="w-16 h-16 text-gray-500" />
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
                      <div className="w-8 h-8 mx-auto mb-1">
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
                      <span className="text-xs">Change</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Remove Image Button */}
              {selectedImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-2 w-full text-center text-red-600 hover:text-red-900 text-sm bg-red-50 hover:bg-red-100 py-1 px-2 rounded-md transition-colors"
                >
                  {t("actions.remove")}
                </button>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {user.username}
        </h1>
              <h3 className="text-md text-gray-400 mb-2">{user.email}</h3>
              <p className="text-lg text-gray-600 mb-4">{t("subtitle")}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {user.emailVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </div>
                    <div className="text-xs text-gray-500">Email Status</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {user.likedArticles?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Liked Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {user.commentedArticles?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Comments</div>
                </div>
              </div>
            </div>
      </div>

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8">
          {/* Personal Information Section */}
          <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-pink-600" />
                  {t("sections.personal")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          value: /^[a-zA-Z0-9_-]+$/,
                          message:
                            "Username can only contain letters, numbers, underscores and dashes",
                        },
                      })}
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
                      {...register("birthDate", {
                        required: "Birth date is required",
                      })}
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-pink-600" />
                  Category Interests
            </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {mainCategories.map((category) => {
                    return (
                      <div
                        key={category}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="mb-2">
                          <h3 className="font-medium text-gray-900 capitalize text-sm mb-2">
                            {category}
                          </h3>
                <select
                              value={
                                watchedValues.subscriptionPreferences?.categories?.includes(category)
                                  ? watchedValues.subscriptionPreferences.subscriptionFrequencies || "weekly"
                                  : "never"
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                
                                // Get current form values to ensure we have the latest state
                                const currentCategories = watchedValues.subscriptionPreferences?.categories || [];
                                const currentFrequency = watchedValues.subscriptionPreferences?.subscriptionFrequencies || "weekly";
                                
                                let newCategories = [...currentCategories];
                                
                                if (value === "never") {
                                  // Remove category if frequency is "never"
                                  newCategories = newCategories.filter(cat => cat !== category);
                                } else {
                                  // Add category if not already present
                                  if (!newCategories.includes(category)) {
                                    newCategories.push(category);
                                  }
                                }

                                setValue("subscriptionPreferences", {
                                  categories: newCategories,
                                  subscriptionFrequencies: value === "never" ? currentFrequency : value,
                                });
                              }}
                              className={`w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-xs ${
                                !watchedValues.subscriptionPreferences?.categories?.includes(category)
                                  ? "text-red-600"
                                  : ""
                              }`}
                            >
                            {newsletterFrequencies.map((frequency) => (
                              <option
                                key={frequency}
                                value={frequency}
                                className={`${
                                  frequency === "never"
                                    ? "text-red-600 font-medium"
                                    : ""
                                }`}
                              >
                                {frequency}
                              </option>
                            ))}
                </select>
              </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                {/* Security Section */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-pink-600" />
                  Security
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </button>
                    <p className="text-sm text-gray-500">
                      Send a password reset link to your email
                    </p>
              </div>
            </div>
          </div>

               {/* Success/Error Messages */}
               {error && (
                 <div className="rounded-md bg-pink-50 border border-pink-200 p-3">
                   <div className="flex items-start">
                     <div className="flex-shrink-0">
                       <svg className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                       </svg>
                     </div>
                     <div className="ml-3 flex-1">
                       <h3 className="text-sm font-medium text-pink-800">Action Required</h3>
                       <div className="mt-1 text-sm text-pink-700">{error}</div>
                     </div>
                     <div className="ml-auto pl-3">
                       <button
                         type="button"
                         onClick={() => setError("")}
                         className="inline-flex rounded-md bg-pink-50 p-1.5 text-pink-500 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2 focus:ring-offset-pink-50"
                       >
                         <span className="sr-only">Dismiss</span>
                         <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                         </svg>
                       </button>
                     </div>
                   </div>
                 </div>
               )}
               
               {success && (
                 <div className="rounded-md bg-green-50 border border-green-200 p-3">
                   <div className="flex items-start">
                     <div className="flex-shrink-0">
                       <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                       </svg>
                     </div>
                     <div className="ml-3 flex-1">
                       <h3 className="text-sm font-medium text-green-800">Success!</h3>
                       <div className="mt-1 text-sm text-green-700">{success}</div>
                     </div>
                     <div className="ml-auto pl-3">
                       <button
                         type="button"
                         onClick={() => setSuccess("")}
                         className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                       >
                         <span className="sr-only">Dismiss</span>
                         <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                         </svg>
                       </button>
                     </div>
                   </div>
                 </div>
               )}

               {/* Save Button - Inline with Security Section */}
              <div className="flex flex-col items-end space-y-2">
            <button
              type="submit"
                  disabled={isLoading || !hasChanges}
                  className="group relative flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            </button>

                {/* Help text when save button is disabled */}
                {!hasChanges && !isLoading && (
                  <p className="text-sm text-gray-500 text-right">
                    Make changes to enable save button
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
