'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import passwordValidation from '@/lib/utils/passwordValidation';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
}

export default function SignUpContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('SignUp');
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Use the register method from useAuth hook
      const registerResult = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate,
      });

      if (registerResult.success) {
        setSuccess(t('accountCreatedSuccess'));
        
        // Registration was successful and user is automatically logged in
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 2000);
      } else {
        setError(registerResult.error || t('failedToCreateAccount'));
      }
    } catch (error) {
      console.error('Registration error:', error);
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
    <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('createAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('alreadyHaveAccount')}{' '}
            <Link href={`/${locale}/signin`} className="font-medium text-violet-600 hover:text-violet-500">
              {t('signUp')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-rose-50 p-4">
              <div className="text-sm text-rose-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                {t('username')}
              </label>
              <input
                id="username"
                type="text"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 5,
                    message: 'Username must be at least 5 characters'
                  },
                  maxLength: {
                    value: 30,
                    message: 'Username cannot exceed 30 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: 'Username can only contain letters, numbers, underscores and dashes'
                  }
                })}
                onChange={(e) => {
                  setValue('username', e.target.value);
                  handleInputChange('username');
                }}
                className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                  errors.username
                    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500'
                } placeholder-gray-500 text-gray-900`}
                placeholder={t('enterUsername')}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-rose-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('emailAddress')}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                onChange={(e) => {
                  setValue('email', e.target.value);
                  handleInputChange('email');
                }}
                className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500'
                } placeholder-gray-500 text-gray-900`}
                placeholder={t('enterEmail')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                {t('birthDate')}
              </label>
              <input
                id="birthDate"
                type="date"
                {...register('birthDate', {
                  required: 'Birth date is required'
                })}
                onChange={(e) => {
                  setValue('birthDate', e.target.value);
                  handleInputChange('birthDate');
                }}
                className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                  errors.birthDate
                    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500'
                } placeholder-gray-500 text-gray-900`}
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-rose-600">{errors.birthDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    validate: (value: string) => {
                      if (!passwordValidation(value)) {
                        return 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol, and be at least 6 characters long';
                      }
                      return true;
                    }
                  })}
                  onChange={(e) => {
                    setValue('password', e.target.value);
                    handleInputChange('password');
                  }}
                  className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500'
                  } placeholder-gray-500 text-gray-900`}
                  placeholder={t('enterPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value: string) => value === password || 'Passwords do not match'
                  })}
                  onChange={(e) => {
                    setValue('confirmPassword', e.target.value);
                    handleInputChange('confirmPassword');
                  }}
                  className={`bg-white mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                    errors.confirmPassword
                      ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-gray-300 focus:ring-violet-500 focus:border-violet-500'
                  } placeholder-gray-500 text-gray-900`}
                  placeholder={t('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {t('createAccount')}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link href={`/${locale}`} className="font-medium text-violet-600 hover:text-violet-500">
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
