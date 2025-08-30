'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

interface FormData {
  email: string;
}

export default function ForgotPasswordContent() {
  const locale = useLocale();
  const t = useTranslations('ForgotPassword');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  // Redirect if already authenticated (this page is only for guests)
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      if (session?.user?.role === 'admin') {
        router.push(`/${locale}/dashboard`);
      } else {
        router.push(`/${locale}/profile`);
      }
    }
  }, [status, session?.user?.id, session?.user?.role, router, locale]);

  // Don't render if already authenticated
  if (status === 'authenticated' && session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600"></div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await authService.requestPasswordReset(data.email);

      // Check if result is a string (success message) or has success property
      if (typeof result === "string") {
        // If result is a string, treat it as a success message
        setSuccess(result || t('resetEmailSent'));
        // Clear the form on success
        setValue('email', '');
      } else if (result && typeof result === "object") {
        // If result is an object, check for success property
        if ("success" in result) {
          if (result.success) {
            // TypeScript knows result has message property when success is true
            const successResult = result as { success: true; message: string; resetLink?: string };
            setSuccess(successResult.message || t('resetEmailSent'));
            // Clear the form on success
            setValue('email', '');
          } else {
            // TypeScript knows result has error property when success is false
            const errorResult = result as { success: false; error: string };
            setError(errorResult.error || t('failedToSendResetEmail'));
          }
        } else {
          // If no success property but result exists, treat as success
          setSuccess(t('resetEmailSent'));
          // Clear the form on success
          setValue('email', '');
        }
      } else {
        // If result is falsy or unexpected format, treat as success (API worked)
        setSuccess(t('resetEmailSent'));
        // Clear the form on success
        setValue('email', '');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(t('unexpectedError'));
    } finally {
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
    <>
      {/* Full Screen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600/50 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-6"></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('forgotPassword')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t('formInstructions')}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-md bg-pink-50 p-4">
                <div className="text-sm text-pink-700">
                  <div className="font-medium mb-2">{t('errorOccurred')}</div>
                  <div className="text-xs text-pink-600">{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">
                  <div className="font-medium mb-2">{t('resetEmailSent')}</div>
                  <div className="text-xs text-green-600">
                    {t('checkEmailInstructions')}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t('emailAddress')}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                {...register('email', {
                  required: t('emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('invalidEmailFormat'),
                  },
                })}
                onChange={(e) => {
                  setValue('email', e.target.value);
                  handleInputChange('email');
                }}
                className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                  errors.email
                    ? 'border-pink-500 focus:ring-pink-500 focus:border-pink-500'
                    : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
                } placeholder-gray-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder={t('emailPlaceholder')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-pink-600">
                  {errors.email.message}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {t('enterEmailForReset')}
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                {isLoading ? t('sendingResetLink') : t('sendResetLink')}
              </button>
            </div>
          </form>

          <div className="text-center space-y-2">
            <Link 
              href={`/${locale}/signin`} 
              className={`block font-medium text-pink-600 hover:text-pink-500 ${
                isLoading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              {t('backToSignIn')}
            </Link>
            <Link 
              href={`/${locale}/signup`} 
              className={`block font-medium text-pink-600 hover:text-pink-500 ${
                isLoading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              {t('dontHaveAccount')}
            </Link>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}`}
              className={`font-medium text-pink-600 hover:text-pink-500 ${
                isLoading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
