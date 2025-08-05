# Trashure

A sustainable fashion marketplace for trading pre-loved items.

## Email Configuration

To enable email sending (verification emails, password resets), you need to configure one of the following options:

### Option 1: Gmail SMTP (Recommended for development)
Add these environment variables to your `.env.local` file:

```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

To get a Gmail app password:
1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings > Security > App passwords
3. Generate a new app password for "Mail"

### Option 2: Custom SMTP Server
Add these environment variables to your `.env.local` file:

```bash
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@your-provider.com
SMTP_PASS=your-password
SMTP_FROM=noreply@your-domain.com
```

### Option 3: Development Mode
If no email configuration is provided, the app will log email content to the console in development mode.

## Required Environment Variables

```bash
# Database
DATABASE_URL=your-database-url

# JWT Secret
JWT_SECRET=your-jwt-secret

# Email (see options above)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Stripe (for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# OpenAI (for AI pricing)
OPENAI_API_KEY=your-openai-api-key
```
