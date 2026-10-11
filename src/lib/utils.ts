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
  const n = Number(amount);
  // Short symbol (৳ / $), and no ".00" on whole amounts, so figures fit in cards.
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, currencyDisplay: 'narrowSymbol', minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n);
}

export function humanize(value: string) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w|\s\w/g, (c) => c.toUpperCase())
    .replace(/\bAc\b/g, 'AC')
    .replace(/\bBkash\b/g, 'bKash');
}
