# Local development setup (step by step)

Follow these steps in order to run Victoria Motors on your machine with Stripe webhooks working.

---

## 1. Prerequisites

- **Node.js 18+** – [nodejs.org](https://nodejs.org)
- **npm** (comes with Node)
- **Supabase account** – [supabase.com](https://supabase.com)
- **Stripe account** – [stripe.com](https://stripe.com)
- **Stripe CLI** (for local webhooks) – [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)  
  - macOS: `brew install stripe/stripe-cli/stripe`

---

## 2. Clone and install

```bash
cd victoria-motors
npm install
```

---

## 3. Environment variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local`. You will fill in values in the next steps. Keep:
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
   - For local dev, use **Stripe test keys** and the webhook secret from the Stripe CLI (step 6).

---

## 4. Supabase setup

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a project (or use an existing one).

2. **Create the database tables**
   - In the project: **SQL Editor** → **New query**
   - Open `supabase/schema.sql` in this repo, copy **all** of its contents, paste into the editor, then **Run**.

3. **Get your keys**
   - In the project: **Settings** (gear) → **API**
   - Copy:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
     - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role** key (click “Reveal”) → `SUPABASE_SERVICE_ROLE_KEY`

4. (Optional) If you already ran part of the schema before: **Settings** → **API** → **Reload schema cache**.

---

## 5. Stripe setup (test mode)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and turn **Test mode** on (toggle in the sidebar).

2. **API keys**
   - **Developers** → **API keys**
   - Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
   - Copy **Secret key** → `STRIPE_SECRET_KEY`

3. **Prices (for subscriptions)**
   - **Products** → open or create a product → **Add price**
   - Create e.g. $49.99/month and $249.99/year (or match your app’s plans)
   - Copy each **Price ID** (e.g. `price_xxx`) into `.env.local`:
     - `STRIPE_MONTHLY_PRICE_ID=price_...`
     - `STRIPE_YEARLY_PRICE_ID=price_...`

4. **Webhook secret for local dev**  
   Do **not** add a webhook endpoint in the Dashboard for localhost. You will use the Stripe CLI in the next step; it will give you a **temporary** webhook secret. Put that in `.env.local` as `STRIPE_WEBHOOK_SECRET` (step 6).

---

## 6. Start the app and Stripe webhook forwarding

You need two terminals: one for the Next.js app, one for the Stripe CLI.

**Terminal 1 – Next.js**

```bash
npm run dev
```

Leave it running. App will be at [http://localhost:3000](http://localhost:3000).

**Terminal 2 – Stripe CLI (forwards webhooks to your app)**

1. Log in (one time):
   ```bash
   stripe login
   ```

2. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. The CLI will print a **webhook signing secret** like:
   ```text
   Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
   ```

4. Copy that value into `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

5. Restart the Next.js dev server (Terminal 1: Ctrl+C, then `npm run dev` again) so it picks up the new secret.

From now on, keep **both** terminals running while you develop:
- Terminal 1: `npm run dev`
- Terminal 2: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

---

## 7. Verify setup

1. Open [http://localhost:3000](http://localhost:3000).
2. Register a new account (use a test email).
3. Complete the flow until you hit Stripe Checkout; use test card `4242 4242 4242 4242`.
4. In Terminal 2 you should see Stripe events (e.g. `checkout.session.completed`) being received.
5. After “payment”, check the portal dashboard; account status and security deposit should update (via the webhook).

---

## Quick reference

| Item              | Value / location                          |
|-------------------|-------------------------------------------|
| App URL           | http://localhost:3000                     |
| Webhook path      | `/api/stripe/webhook`                     |
| Stripe test card  | 4242 4242 4242 4242                       |
| Env file          | `.env.local` (never commit this)          |
| Schema            | `supabase/schema.sql`                     |

---

## Troubleshooting

- **“Table 'public.customers' not in schema cache”**  
  Run `supabase/schema.sql` in the Supabase SQL Editor, then reload schema cache (Supabase → Settings → API).

- **Webhook returns 401 or “Invalid signature”**  
  Ensure `STRIPE_WEBHOOK_SECRET` in `.env.local` is exactly the secret from `stripe listen` (starts with `whsec_`) and that you restarted `npm run dev` after changing it.

- **Payments succeed but dashboard doesn’t update**  
  Make sure `stripe listen` is running and that no errors appear in Terminal 2 when you complete checkout.

- **Stripe CLI not found**  
  Install it: [stripe.com/docs/stripe-cli#install](https://stripe.com/docs/stripe-cli#install) (e.g. `brew install stripe/stripe-cli/stripe` on macOS).
