import type { JobCategory, JobStatus, PaymentStatus, Priority, Role } from '@/types/api';

export const ACCESS_COOKIE = 'sp_access';
export const REFRESH_COOKIE = 'sp_refresh';

export const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: '/dashboard',
  TECHNICIAN: '/provider',
  ADMIN: '/admin',
};

// Route prefix -> the one role allowed to see it (enforced in middleware.ts and again in each layout).
export const ROLE_PREFIXES: Record<string, Role> = {
  '/dashboard': 'CUSTOMER',
  '/provider': 'TECHNICIAN',
  '/admin': 'ADMIN',
};

export const DEMO_ACCOUNTS: { role: Role; label: string; description: string; email: string; password: string }[] = [
  { role: 'ADMIN', label: 'Admin', description: 'Dispatch, verify technicians, view analytics', email: 'admin@servicepro.com', password: 'Admin123!' },
  { role: 'CUSTOMER', label: 'Customer', description: 'Request services, track jobs, pay invoices', email: 'demo.customer@servicepro.com', password: 'Customer123!' },
  { role: 'TECHNICIAN', label: 'Technician', description: 'Work assigned jobs and file service reports', email: 'demo.technician@servicepro.com', password: 'Technician123!' },
];

export const JOB_CATEGORIES: JobCategory[] = ['ELECTRICAL', 'PLUMBING', 'AC_REPAIR', 'APPLIANCE_REPAIR', 'CARPENTRY', 'PAINTING', 'CLEANING', 'OTHER'];
export const JOB_STATUSES: JobStatus[] = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
export const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
export const PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED'];

export const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  ASSIGNED: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  ACCEPTED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300',
  IN_PROGRESS: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
  COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  CANCELLED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  PROCESSING: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  PAID: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  FAILED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  REFUNDED: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
  LOW: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
  MEDIUM: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
  URGENT: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/** Role-specific detail page for a job. The backend's notification links use a generic /jobs/:id. */
export function jobHref(role: Role | undefined, id: string) {
  if (role === 'ADMIN') return `/admin/jobs/${id}`;
  if (role === 'TECHNICIAN') return `/provider/jobs/${id}`;
  return `/dashboard/jobs/${id}`;
}

/** WebSocket origin for live notifications (the API serves /ws). Override with NEXT_PUBLIC_WS_URL. */
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || API_URL.replace(/^http/, 'ws').replace(/\/api\/v\d+\/?$/, '');
