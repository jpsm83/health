# Email Actions System Documentation

## Overview

The Email Actions System is a comprehensive, server-side email handling architecture built with Next.js Server Actions. It provides a clean separation of concerns between business logic, email sending, and API routing while maintaining consistency across all email flows.

## Architecture Principles

### 1. **Single Responsibility Principle**
Each action file has one clear purpose:
- **Request Actions**: Handle business logic + email sending
- **Confirmation Actions**: Handle database operations
- **Email Utilities**: Handle email templates and sending

### 2. **Consistent Structure**
All email flows follow the same pattern:
```
📧 [Flow Name] Flow:
├── request[FlowName].ts     → Business logic + email sending
└── confirm[FlowName].ts     → Database operations
```

### 3. **Thin API Layer**
API routes act as thin layers that delegate to actions:
```typescript
// API Route
const result = await actionName(params);
return NextResponse.json(result);
```

## Email Flows

### 1. Newsletter Subscription Flow

#### Files:
- `app/actions/email/newsletterSubscribe.ts`
- `app/actions/email/confirmNewsletterSubscription.ts`
- `app/actions/email/newsletterUnsubscribe.ts`

#### Flow:
```
1. User subscribes → newsletterSubscribe.ts
   ├── Validates email format
   ├── Checks existing users/subscribers
   ├── Generates verification & unsubscribe tokens
   ├── Creates/updates subscriber record
   ├── Validates email (disposable email check)
   └── Sends confirmation email

2. User clicks confirmation link → confirmNewsletterSubscription.ts
   ├── Validates token and email
   ├── Finds subscriber
   ├── Marks email as verified
   ├── Clears verification token
   └── Generates new unsubscribe token

3. User unsubscribes → newsletterUnsubscribe.ts
   ├── Validates email and token
   ├── Finds subscriber
   ├── Validates unsubscribe token
   └── Deactivates subscription (or deletes if no user account)
```

#### API Routes:
- `POST /api/v1/subscribers` → calls `newsletterSubscribe.ts`
- `DELETE /api/v1/subscribers` → calls `newsletterUnsubscribe.ts`

#### Frontend Components:
- `components/NewsletterSignup.tsx` → calls `newsletterSubscribe.ts`
- `pagesClient/ConfirmNewsletter.tsx` → calls `confirmNewsletterSubscription.ts`
- `app/[locale]/unsubscribe/page.tsx` → calls `newsletterUnsubscribe.ts`

### 2. Email Confirmation Flow

#### Files:
- `app/actions/email/requestEmailConfirmation.ts`
- `app/actions/email/confirmEmail.ts`

#### Flow:
```
1. User requests email confirmation → requestEmailConfirmation.ts
   ├── Validates email
   ├── Checks if user exists
   ├── Checks if already verified
   ├── Generates verification token
   ├── Updates user record
   └── Sends confirmation email (multilingual)

2. User clicks confirmation link → confirmEmail.ts
   ├── Validates token
   ├── Finds user with valid token
   ├── Checks if already verified
   ├── Updates user email verification status
   ├── Clears verification token
   └── Updates linked subscriber (if exists)
```

#### API Routes:
- `POST /api/v1/auth/request-email-confirmation` → calls `requestEmailConfirmation.ts`
- `POST /api/v1/auth/confirm-email` → calls `confirmEmail.ts`

#### Frontend Components:
- `pagesClient/Profile.tsx` → calls `requestEmailConfirmation.ts`
- `app/[locale]/confirm-email/page.tsx` → calls `confirmEmail.ts`

### 3. Password Reset Flow

#### Files:
- `app/actions/email/requestPasswordReset.ts`
- `app/actions/email/resetPassword.ts`

#### Flow:
```
1. User requests password reset → requestPasswordReset.ts
   ├── Validates email
   ├── Checks if user exists
   ├── Generates reset token (1 hour expiry)
   ├── Updates user record with token
   └── Sends reset email (multilingual)

2. User resets password → resetPassword.ts
   ├── Validates token and password
   ├── Checks token expiry
   ├── Finds user with valid token
   ├── Hashes new password
   ├── Updates password
   └── Clears reset token
```

#### API Routes:
- `POST /api/v1/auth/forgot-password` → calls `requestPasswordReset.ts`
- `POST /api/v1/auth/reset-password` → calls `resetPassword.ts`

#### Frontend Components:
- `pagesClient/ForgotPassword.tsx` → calls `requestPasswordReset.ts`
- `pagesClient/ResetPassword.tsx` → calls `resetPassword.ts`

### 4. Newsletter Broadcasting Flow

#### Files:
- `app/actions/email/sendNewsletter.ts`

#### Flow:
```
1. Admin sends newsletter → sendNewsletter.ts
   ├── Gets all verified subscribers
   ├── Validates email configuration
   ├── Sends newsletter to each subscriber
   ├── Handles individual email failures
   └── Returns success count and errors
```

#### API Routes:
- `POST /api/v1/newsletter/send` → calls `sendNewsletter.ts`

### 5. Comment Report Notification Flow

#### Files:
- `app/actions/email/commentReport.ts`

#### Flow:
```
1. Comment is reported → commentReport.ts
   ├── Validates email configuration
   ├── Generates multilingual email content
   ├── Includes comment details and report reason
   └── Sends notification to comment author
```

## Shared Email Utilities

### Email Configuration
All email actions use shared utilities for:
- **Transporter Creation**: Gmail SMTP configuration
- **Email Validation**: Environment variable checks
- **Email Sending**: Consistent error handling

### Multilingual Support
Email templates support 8 languages:
- English (en)
- Portuguese (pt)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Dutch (nl)
- Hebrew (he)
- Russian (ru)

### Email Templates
All emails follow a consistent design:
- **Header**: Women Spot branding with pink theme
- **Content**: Localized messages and instructions
- **Actions**: Call-to-action buttons
- **Footer**: Copyright and unsubscribe links

## Database Models

### User Model
```typescript
{
  email: string;
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  subscriptionId?: ObjectId;
}
```

### Subscriber Model
```typescript
{
  email: string;
  emailVerified: boolean;
  verificationToken?: string;
  unsubscribeToken?: string;
  subscriptionPreferences: {
    categories: string[];
    subscriptionFrequencies: string;
  };
  userId?: ObjectId;
}
```

## Error Handling

### Consistent Error Response Format
```typescript
interface EmailActionResult {
  success: boolean;
  message: string;
  error?: string;
}
```

### Error Types
- **Validation Errors**: Invalid email format, missing fields
- **Business Logic Errors**: User already exists, email already verified
- **Email Service Errors**: SMTP failures, bounce handling
- **Database Errors**: Connection issues, transaction failures

## Security Features

### Token Management
- **Verification Tokens**: Random 32-character hex strings
- **Reset Tokens**: 1-hour expiry for password resets
- **Unsubscribe Tokens**: Unique per subscriber for secure unsubscription

### Email Validation
- **Format Validation**: Regex-based email format checking
- **Disposable Email Detection**: Blocks common temporary email services
- **Bounce Handling**: Removes invalid email addresses from database

### Rate Limiting
- **Email Sending**: Individual error handling per recipient
- **Token Generation**: Secure random token generation
- **Database Transactions**: Atomic operations for data consistency

## Environment Variables

### Required Configuration
```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-app-password
NEXTAUTH_URL=https://your-domain.com
```

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in `EMAIL_PASSWORD`

## API Endpoints Summary

| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/subscribers` | `newsletterSubscribe` | Subscribe to newsletter |
| DELETE | `/api/v1/subscribers` | `newsletterUnsubscribe` | Unsubscribe from newsletter |
| POST | `/api/v1/newsletter/send` | `sendNewsletter` | Send newsletter to all subscribers |
| POST | `/api/v1/auth/request-email-confirmation` | `requestEmailConfirmation` | Request email confirmation |
| POST | `/api/v1/auth/confirm-email` | `confirmEmail` | Confirm email address |
| POST | `/api/v1/auth/forgot-password` | `requestPasswordReset` | Request password reset |
| POST | `/api/v1/auth/reset-password` | `resetPassword` | Reset password with token |

## Frontend Pages

| Page | Route | Action Used | Description |
|------|-------|-------------|-------------|
| Newsletter Signup | `/` | `newsletterSubscribe` | Homepage newsletter signup |
| Confirm Newsletter | `/confirm-newsletter` | `confirmNewsletterSubscription` | Newsletter confirmation page |
| Unsubscribe | `/unsubscribe` | `newsletterUnsubscribe` | Newsletter unsubscribe page |
| Confirm Email | `/confirm-email` | `confirmEmail` | Email confirmation page |
| Forgot Password | `/forgot-password` | `requestPasswordReset` | Password reset request page |
| Reset Password | `/reset-password` | `resetPassword` | Password reset form page |
| Profile | `/profile` | `requestEmailConfirmation` | User profile with email management |

## Development Guidelines

### Adding New Email Flows
1. Create request action (business logic + email sending)
2. Create confirmation action (database operations)
3. Add API routes that delegate to actions
4. Create frontend pages/components
5. Add multilingual support
6. Update this documentation

### Testing Email Actions
1. **Unit Tests**: Test individual action functions
2. **Integration Tests**: Test API routes with actions
3. **Email Testing**: Use test email addresses
4. **Error Scenarios**: Test validation and error handling

### Monitoring and Logging
- **Email Sending**: Log success/failure for each email
- **Token Usage**: Track verification and reset token usage
- **Error Tracking**: Monitor and alert on email service failures
- **Performance**: Track email sending performance

## Troubleshooting

### Common Issues
1. **Email Not Sending**: Check Gmail credentials and 2FA setup
2. **Token Expiry**: Verify token generation and expiry logic
3. **Database Errors**: Check MongoDB connection and transaction handling
4. **Multilingual Issues**: Verify locale detection and translation keys

### Debug Steps
1. Check environment variables
2. Verify database connections
3. Test email configuration
4. Review error logs
5. Validate token generation

## Future Enhancements

### Planned Features
- **Email Templates**: Dynamic template system
- **Analytics**: Email open/click tracking
- **A/B Testing**: Email content optimization
- **Scheduling**: Automated newsletter sending
- **Segmentation**: Targeted email campaigns

### Technical Improvements
- **Queue System**: Background email processing
- **Retry Logic**: Automatic retry for failed emails
- **Rate Limiting**: Prevent email spam
- **Monitoring**: Real-time email delivery tracking