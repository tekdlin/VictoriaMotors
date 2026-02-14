/**
 * Application constants. Use for routes, config keys, and shared literals.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_INDIVIDUAL: '/register/individual',
  REGISTER_BUSINESS: '/register/business',
  PORTAL: '/portal',
  PORTAL_DOCUMENTS: '/portal/documents',
  PORTAL_INVOICES: '/portal/invoices',
  PORTAL_PAYMENTS: '/portal/payments',
  PORTAL_TOPUP: '/portal/topup',
  ADMIN: '/admin',
  ADMIN_CUSTOMERS: '/admin/customers',
} as const;

export const API_ROUTES = {
  AUTH_SESSION: '/api/auth/session',
  ME: '/api/me',
  ME_PAYMENTS: '/api/me/payments',
  ME_INVOICES: '/api/me/invoices',
  ME_DOCUMENTS: '/api/me/documents',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_CUSTOMERS: '/api/admin/customers',
  STRIPE_CHECKOUT: '/api/stripe/checkout',
  STRIPE_PORTAL: '/api/stripe/portal',
  STRIPE_TOPUP: '/api/stripe/topup',
} as const;
