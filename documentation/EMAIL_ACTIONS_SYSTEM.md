# Email Actions System Documentation

## Overview

The Email Actions System is a modular, server-side email handling architecture built with Next.js Server Actions. It provides a clean separation of concerns between business logic, email sending, and API routing while maintaining consistency across all email flows.

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
   ├── Validates email
   ├── Checks existing users/subscribers
   ├── Generates tokens
   ├── Creates/updates subscriber record
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
   └── Deactivates subscription
```

#### API Routes:
- `POST /api/v1/subscribers` → calls `newsletterSubscribe.ts`
- `DELETE /api/v1/subscribers` → calls `newsletterUnsubscribe.ts`

#### Frontend Components:
- `components/NewsletterSignup.tsx` → calls `newsletterSubscribe.ts`
- `pagesClient/ConfirmNewsletter.tsx` → calls `confirmNewsletterSubscription.ts`
- `pagesClient/Unsubscribe.tsx` → calls `newsletterUnsubscribe.ts`

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
   └── Sends confirmation email

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
- `pagesClient/ConfirmEmail.tsx` → calls `confirmEmail.ts`

### 3. Password Reset Flow

#### Files:
- `app/actions/email/requestPasswordReset.ts`
- `app/actions/email/resetPassword.ts`

#### Flow:
```
1. User requests password reset → requestPasswordReset.ts
   ├── Validates email
   ├── Checks if user exists
   ├── Generates reset token
   ├── Sets token expiry (1 hour)
   ├── Updates user record
   └── Sends reset email

2. User submits new password → resetPassword.ts
   ├── Validates token and password
   ├── Checks token expiry
   ├── Finds user with valid token
   ├── Hashes new password
   ├── Updates password
   └── Clears reset tokens
```

#### API Routes:
- `POST /api/v1/auth/forgot-password` → calls `requestPasswordReset.ts`
- `POST /api/v1/auth/reset-password` → calls `resetPassword.ts`

#### Frontend Components:
- `pagesClient/Profile.tsx` → calls `requestPasswordReset.ts`
- `pagesClient/ResetPassword.tsx` → calls `resetPassword.ts`

### 4. Comment Reporting Flow

#### Files:
- `app/actions/email/commentReports.ts`
- `app/actions/email/commentReport.ts`

#### Flow:
```
1. User reports comment → commentReports.ts
   ├── Validates input parameters
   ├── Checks if comment exists
   ├── Checks if already reported
   ├── Adds report to comment
   ├── Gets comment author info
   └── Sends notification email

2. Email sending → commentReport.ts
   ├── Validates email config
   ├── Generates email content
   └── Sends email via transporter
```

#### API Routes:
- `POST /api/v1/test-actions/comment-reports/[articleId]/[commentId]` → calls `commentReports.ts`

#### Frontend Components:
- `components/CommentsSection.tsx` → calls `commentReports.ts`

## Shared Email Utilities

### Common Functions in Each Action:

```typescript
// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email configuration validation
const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email configuration is missing...");
  }
};

// Email sending with transporter
const sendEmailWithTransporter = async (mailOptions) => {
  const transporter = createTransporter();
  const info = await transporter.sendMail(mailOptions);
  return { success: true, data: { messageId: info.messageId } };
};
```

## Internationalization (i18n)

### Supported Languages:
- English (en)
- Portuguese (pt)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Dutch (nl)
- Hebrew (he)
- Russian (ru)

### Translation Structure:
```typescript
const emailTranslations = {
  en: {
    subject: "Email Subject - Women Spot",
    greeting: "Hello",
    message: "Email message content...",
    // ... other translations
  },
  // ... other languages
};
```

## Error Handling

### Standard Error Response Format:
```typescript
interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
}
```

### Error Handling Patterns:
1. **Validation Errors**: Return `success: false` with descriptive message
2. **Database Errors**: Log error and return generic message
3. **Email Errors**: Log error but don't fail the entire operation
4. **Security Errors**: Return generic message to avoid information leakage

## Database Operations

### Transaction Handling:
```typescript
// For operations affecting multiple collections
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Multiple database operations
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}
```

### Common Database Patterns:
- **User Lookup**: `User.findOne({ email })`
- **Token Validation**: `User.findOne({ token, expires: { $gt: Date.now() } })`
- **Update Operations**: `User.findByIdAndUpdate(id, updates)`

## Security Considerations

### 1. **Token Security**
- Tokens are cryptographically secure (32 bytes)
- Tokens have expiration times
- Tokens are cleared after use

### 2. **Email Security**
- Don't reveal if user exists or not
- Use generic error messages
- Validate all inputs

### 3. **Password Security**
- Passwords are hashed with bcrypt
- Reset tokens expire in 1 hour
- Old tokens are cleared after successful reset

## Environment Variables

### Required Variables:
```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Application URL
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=your-mongodb-connection-string
```

## Testing and Development

### Development Mode:
- Reset links are included in API responses for testing
- Detailed error logging
- Email configuration validation

### Production Mode:
- No sensitive data in responses
- Minimal error information
- Proper error handling

## File Structure

```
app/actions/email/
├── newsletterSubscribe.ts           # Newsletter subscription + email
├── confirmNewsletterSubscription.ts # Newsletter confirmation
├── newsletterUnsubscribe.ts         # Newsletter unsubscription
├── requestEmailConfirmation.ts      # Email confirmation request + email
├── confirmEmail.ts                  # Email confirmation
├── requestPasswordReset.ts          # Password reset request + email
├── resetPassword.ts                 # Password reset
├── commentReports.ts                # Comment reporting + email
└── commentReport.ts                 # Comment report email utility
```

## Best Practices

### 1. **Action Design**
- Keep actions focused on single responsibility
- Include comprehensive error handling
- Use TypeScript interfaces for return types
- Validate all inputs

### 2. **Email Templates**
- Use consistent styling across all emails
- Include fallback text versions
- Support multiple languages
- Include proper unsubscribe links

### 3. **Database Operations**
- Use transactions for multi-collection operations
- Handle database connection errors
- Clean up temporary data on failures

### 4. **API Integration**
- Keep API routes thin
- Delegate business logic to actions
- Return consistent response formats
- Handle errors gracefully

## Troubleshooting

### Common Issues:

1. **Email Not Sending**
   - Check environment variables
   - Verify Gmail app password
   - Check email configuration

2. **Token Issues**
   - Verify token generation
   - Check token expiration
   - Ensure proper cleanup

3. **Database Errors**
   - Check MongoDB connection
   - Verify collection schemas
   - Check transaction handling

### Debugging Tips:
- Enable detailed logging in development
- Use development reset links for testing
- Check browser network tab for API errors
- Verify database state after operations

## Future Enhancements

### Potential Improvements:
1. **Email Queue System**: For handling high-volume email sending
2. **Email Templates**: Centralized template management
3. **Email Analytics**: Track email open rates and clicks
4. **Email Scheduling**: Send emails at specific times
5. **Email Preferences**: User-configurable email settings

### Scalability Considerations:
- Consider using Redis for token storage
- Implement email rate limiting
- Use email service providers for high volume
- Add email delivery status tracking

---

This documentation provides a comprehensive overview of the Email Actions System. For specific implementation details, refer to the individual action files and their corresponding API routes.
