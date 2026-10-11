import { BarChart3, ClipboardList, CreditCard, FileText, LayoutDashboard, PlusCircle, ShieldCheck, UserCog, Users, Wallet, type LucideIcon } from 'lucide-react';
import type { Role } from '@/types/api';

export interface NavItem { href: string; label: string; icon: LucideIcon; exact?: boolean; keywords?: string }

export const NAV: Record<Role, NavItem[]> = {
  CUSTOMER: [
    { href: '/dashboard', label: 'My requests', icon: LayoutDashboard, exact: true, keywords: 'jobs home' },
    { href: '/dashboard/jobs/new', label: 'New request', icon: PlusCircle, keywords: 'create book repair' },
    { href: '/dashboard/payments', label: 'Payments', icon: CreditCard, keywords: 'billing receipts' },
    { href: '/dashboard/profile', label: 'Profile', icon: UserCog, keywords: 'account settings avatar' },
  ],
  TECHNICIAN: [
    { href: '/provider', label: 'My jobs', icon: ClipboardList, exact: true, keywords: 'schedule assigned' },
    { href: '/provider/earnings', label: 'Earnings', icon: Wallet, keywords: 'income money' },
    { href: '/provider/profile', label: 'Profile & availability', icon: UserCog, keywords: 'skills schedule location' },
  ],
  ADMIN: [
    { href: '/admin', label: 'Overview', icon: BarChart3, exact: true, keywords: 'analytics dashboard stats' },
    { href: '/admin/jobs', label: 'Jobs', icon: ClipboardList, keywords: 'requests assign dispatch' },
    { href: '/admin/technicians', label: 'Technicians', icon: ShieldCheck, keywords: 'verify approve' },
    { href: '/admin/users', label: 'Users', icon: Users, keywords: 'roles accounts' },
    { href: '/admin/reports', label: 'Audit logs', icon: FileText, keywords: 'activity history reports' },
  ],
};
