import { z } from 'zod';
import { JOB_CATEGORIES, PRIORITIES } from './constants';

// These mirror the backend's Zod schemas (servicepro-fsms/src/validators) so users
// see the same rules client-side that the API enforces.
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(100),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['CUSTOMER', 'TECHNICIAN']),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Please tell us your name'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(3, 'Subject is too short'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Create-job wizard: one schema per step so each step validates before "Next".
export const jobStepOneSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  category: z.enum(JOB_CATEGORIES as [string, ...string[]]),
  priority: z.enum(PRIORITIES as [string, ...string[]]),
});
export const jobStepTwoSchema = z.object({
  description: z.string().min(10, 'Describe the problem in at least 10 characters'),
  address: z.string().min(5, 'Enter the full service address'),
  estimatedCost: z.string().optional().refine((v) => !v || Number(v) > 0, 'Budget must be a positive number'),
});
export const jobSchema = jobStepOneSchema.merge(jobStepTwoSchema);

export const assignSchema = z.object({
  technicianId: z.string().uuid('Select a technician'),
  scheduledAt: z.string().min(1, 'Choose a date and time'),
});

export const serviceReportSchema = z.object({
  summary: z.string().min(5, 'Summary must be at least 5 characters'),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  laborHours: z.string().optional().refine((v) => !v || Number(v) > 0, 'Hours must be positive'),
  partsUsed: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  punctuality: z.number().int().min(1).max(5),
  professionalism: z.number().int().min(1).max(5),
  quality: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const technicianProfileSchema = z.object({
  skills: z.string().min(1, 'Add at least one skill'),
  serviceAreas: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type AssignInput = z.infer<typeof assignSchema>;
export type ServiceReportInput = z.infer<typeof serviceReportSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
