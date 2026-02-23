# Victoria Motors - Automated Customer & Inventory Platform

A modern, full-stack web application for automotive financing built with Next.js 14, Supabase, and Stripe.

## 🚀 Features (Phase 1 MVP)

### Customer Features
- **Account Registration**: Individual and Business account types
- **Document Upload**: Secure upload for driver's license and business documents
- **Subscription Management**: Monthly and yearly subscription plans
- **Security Deposit**: 10% refundable deposit system
- **Customer Portal**: Dashboard with account overview, payment history, invoices

### Admin Features
- **Dashboard**: Overview of customers, payments, and revenue
- **Customer Management**: View and manage all customer accounts
- **Payment Monitoring**: Track all transactions and deposits

### Technical Features
- **Authentication**: Supabase Auth with protected routes
- **Payments**: Stripe Checkout, Subscriptions, and Customer Portal
- **Webhooks**: Real-time payment status updates
- **File Storage**: Secure document storage with Supabase Storage
- **Database**: PostgreSQL with Row Level Security (RLS)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd victoria-motors
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Settings > API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

3. Create subscription products:
   - Go to **Products** > **Add Product**
   - Create "Monthly Plan" at $49.99/month
   - Create "Yearly Plan" at $249.99/year
   - Copy the Price IDs to your environment variables

4. Set up webhooks:
   - Go to **Developers > Webhooks**
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `invoice.paid`
     - `invoice.payment_failed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.upcoming`
   - Copy the webhook secret → `STRIPE_WEBHOOK_SECRET`

### 4. Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Test Stripe Webhooks Locally

**For a full step-by-step local setup** (env, Supabase, Stripe test mode, webhook secret), see **[docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md)**.

Quick version: install [Stripe CLI](https://stripe.com/docs/stripe-cli), then run:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Use the printed `whsec_...` value as `STRIPE_WEBHOOK_SECRET` in `.env.local` and restart `npm run dev`.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production URL
2. Update Stripe webhook endpoint to production URL
3. Switch Stripe to live mode and update keys

## 📁 Project Structure

```
victoria-motors/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (portal)/          # Customer portal
│   │   ├── (admin)/           # Admin dashboard
│   │   ├── api/               # API routes
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   └── forms/             # Form components
│   ├── lib/
│   │   ├── supabase/          # Supabase client config
│   │   ├── stripe/            # Stripe config
│   │   ├── utils.ts           # Utility functions
│   │   └── validations.ts     # Zod schemas
│   └── types/                 # TypeScript types
├── supabase/
│   └── schema.sql             # Database schema
└── public/                    # Static assets
```

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Secure document storage with access control
- Encrypted data transmission (HTTPS)
- Stripe PCI compliance for payments
- Protected routes with middleware

## 📊 Database Schema

### Main Tables
- `customers` - Customer accounts and profiles
- `documents` - Uploaded verification documents
- `payments` - Payment transaction records
- `invoices` - Stripe invoice records
- `audit_logs` - Activity logging

## 🧪 Testing

### Test Cards (Stripe Test Mode)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## 🗺️ Roadmap

### Phase 2 (Supplier Integration)
- [ ] Supplier API integration
- [ ] Automatic customer number assignment
- [ ] Real-time inventory sync
- [ ] Enhanced admin tools

### Phase 3 (Optimization)
- [ ] Advanced portal UX
- [ ] Automated refund workflows
- [ ] Advanced reporting
- [ ] CRM features

## 📝 License

Proprietary - Victoria Motors

## 🤝 Support

For support, email support@victoriamotors.com
