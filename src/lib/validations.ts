import { z } from 'zod';

// Common schemas
export const emailSchema = z.string().email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
  .transform(val => val.replace(/\D/g, ''))
  .refine(val => val.length >= 10 && val.length <= 15, 'Phone number must be between 10 and 15 digits');

export const addressSchema = z.object({
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'Please use state abbreviation'),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
});

// Individual registration schema
export const individualRegistrationSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: phoneSchema,
  date_of_birth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(val => {
      const dob = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 18;
    }, 'You must be at least 18 years old'),
  ...addressSchema.shape,
  purchase_value: z
    .number()
    .min(0, 'Minimum purchase value is $0')
    .max(500000, 'Maximum purchase value is $500,000'),
  subscription_plan: z.enum(['monthly', 'yearly'], {
    required_error: 'Please select a subscription plan',
  }),
  terms_accepted: z
    .boolean()
    .refine((val) => val === true, { message: 'You must accept the terms and conditions' })
    .transform(() => true as const),
});

// Business registration schema
export const businessRegistrationSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  business_ein: z
    .string()
    .regex(/^\d{2}-?\d{7}$/, 'Please enter a valid EIN (XX-XXXXXXX)')
    .transform(val => val.replace(/\D/g, '')),
  business_contact_name: z.string().min(1, 'Contact name is required'),
  email: emailSchema,
  phone: phoneSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  ...addressSchema.shape,
  purchase_value: z
    .number()
    .min(0, 'Minimum purchase value is $0')
    .max(2000000, 'Maximum purchase value is $2,000,000'),
  subscription_plan: z.enum(['monthly', 'yearly'], {
    required_error: 'Please select a subscription plan',
  }),
  terms_accepted: z
    .boolean()
    .refine((val) => val === true, { message: 'You must accept the terms and conditions' })
    .transform(() => true as const),
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Signup schema
export const signupSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Deposit top-up schema
export const depositTopUpSchema = z.object({
  amount: z
    .number()
    .min(100, 'Minimum top-up amount is $100')
    .max(100000, 'Maximum top-up amount is $100,000'),
});

// Types (output = after transform/parse; input = form state)
export type IndividualRegistrationInput = z.infer<typeof individualRegistrationSchema>;
export type IndividualRegistrationFormValues = z.input<typeof individualRegistrationSchema>;
export type BusinessRegistrationInput = z.infer<typeof businessRegistrationSchema>;
export type BusinessRegistrationFormValues = z.input<typeof businessRegistrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type DepositTopUpInput = z.infer<typeof depositTopUpSchema>;
