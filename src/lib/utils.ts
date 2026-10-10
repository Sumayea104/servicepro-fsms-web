import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | null, pattern = 'dd MMM yyyy') {
  return value ? format(new Date(value), pattern) : '—';
}

export function formatDateTime(value?: string | null) {
  return value ? format(new Date(value), 'dd MMM yyyy, hh:mm a') : '—';
}

export function timeAgo(value: string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function formatCurrency(amount: number | string | null | undefined, currency = 'BDT') {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(amount));
}

export function humanize(value: string) {
  return value.replace(/_/g, ' ').toLowerCase().replace(/^\w|\s\w/g, (c) => c.toUpperCase());
}
