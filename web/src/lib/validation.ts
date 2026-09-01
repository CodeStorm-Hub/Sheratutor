import { z } from 'zod';

/** Shared field schemas — used across the auth / onboarding / profile / waitlist
 *  / generate-paper server actions so the rules live in one place. */

export const educationBoard = z.enum([
  'DHAKA',
  'RAJSHAHI',
  'COMILLA',
  'BARISAL',
  'SYLHET',
  'CHITTAGONG',
  'JESSORE',
  'DINAJPUR',
  'MYMENSINGH',
  'MADRASAH',
  'TECHNICAL',
]);

export const examType = z.enum(['SSC', 'HSC']);

/** The landing waitlist also accepts university-admission aspirants, who have no
 *  SSC/HSC profile yet. Kept separate so onboarding / profile stay SSC-or-HSC. */
export const waitlistExamType = z.enum(['SSC', 'HSC', 'ADMISSION']);

export const academicGroup = z.enum(['SCIENCE', 'HUMANITIES', 'BUSINESS_STUDIES']);

export const targetExamYear = z.coerce.number().int().min(2026).max(2030);

/** Bangladeshi mobile number: +8801XXXXXXXXX / 8801XXXXXXXXX / 01XXXXXXXXX. */
export const bdPhone = z
  .string()
  .regex(/^(\+?880|0)1[3-9]\d{8}$/, 'Enter a valid Bangladeshi phone number');

export const credentials = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});
