# Authentication System Documentation

## Overview

This application uses NextAuth.js for authentication with a modern, secure approach. Users can browse content without authentication, but need to sign in to interact with articles (like, comment, etc.).

## Features

- **Dual Authentication**: Google OAuth + Email/Password credentials
- **JWT Strategy**: Secure token-based sessions
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Modern UI**: Responsive design with loading states and error handling
- **TypeScript**: Full type safety throughout the authentication flow

## Architecture

### 1. Authentication Provider (`components/AuthProvider.tsx`)
Wraps the entire application with NextAuth's SessionProvider for global session management.

### 2. Custom Hook (`hooks/useAuth.tsx`)
Provides a clean interface for authentication operations:
- `user`: Current user session data
- `isAuthenticated`: Boolean indicating authentication status
- `isLoading`: Loading state during authentication checks
- `login(provider, credentials?)`: Sign in with Google or credentials
- `logout()`: Sign out and redirect to home
- `update()`: Refresh session data

### 3. Protected Route Component (`components/ProtectedRoute.tsx`)
Automatically redirects unauthenticated users to the sign-in page.

### 4. Authentication Pages
- **Sign In** (`/signin`): Login with existing account
- **Sign Up** (`/signup`): Create new account

## Usage Examples

### Basic Authentication Check
```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return <div>Welcome, {user?.name}!</div>;
}
```

### Protected Route
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

### Login Function
```tsx
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    const result = await login('google');
    if (result.success) {
      // Redirect or show success message
    }
  };

  const handleCredentialsLogin = async (email: string, password: string) => {
    const result = await login('credentials', { email, password });
    if (result.success) {
      // Redirect or show success message
    } else {
      // Handle error
      console.error(result.error);
    }
  };
}
```

## API Endpoints

### Authentication (NextAuth)
- **GET/POST** `/api/v1/auth/[...nextauth]`
- Handles login, logout, and session management with email/password credentials

### User Registration
- **POST** `/api/v1/auth/register`
- **Body**: `{ username, email, password, birthDate, categoryInterests? }`
- **Response**: User creation confirmation

### Password Reset
- **POST** `/api/v1/auth/reset-password`
- **Body**: `{ email }`
- **Response**: Password reset link sent confirmation

- **POST** `/api/v1/auth/reset-password/confirm`
- **Body**: `{ token, newPassword }`
- **Response**: Password reset success confirmation

## Environment Variables Required

```env
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
AUTH_SECRET=your_nextauth_secret
```

## Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **JWT Tokens**: Secure session management
3. **CSRF Protection**: Built-in NextAuth.js protection
4. **Input Validation**: Server-side validation for all inputs
5. **Duplicate Prevention**: Email and username uniqueness checks

## Best Practices

1. **Always use the `useAuth` hook** instead of directly calling NextAuth functions
2. **Wrap protected pages** with `ProtectedRoute` component
3. **Handle loading states** in your components
4. **Use TypeScript** for better type safety
5. **Implement proper error handling** for authentication failures

## Migration from Old System

If you're migrating from a different authentication system:

1. Replace direct authentication calls with `useAuth` hook
2. Wrap protected content with `ProtectedRoute`
3. Update your components to handle loading states
4. Ensure your API routes check authentication status

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check if `AuthProvider` wraps your app
2. **Protected routes not working**: Verify `ProtectedRoute` component usage
3. **Google OAuth errors**: Verify environment variables and Google Console setup
4. **Database connection issues**: Check MongoDB connection string

### Debug Mode

Enable debug mode in development:
```typescript
// In auth.ts
debug: process.env.NODE_ENV === "development"
```

## Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Social login providers (GitHub, Facebook, etc.)
- [ ] Role-based access control
- [ ] Session timeout management
