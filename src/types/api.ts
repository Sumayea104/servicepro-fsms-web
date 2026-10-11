// Mirrors servicepro-fsms backend Prisma enums/models — kept in sync by hand
// since this is a separate repo from the backend.

export type Role = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
export type JobStatus = 'PENDING' | 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type JobCategory = 'ELECTRICAL' | 'PLUMBING' | 'AC_REPAIR' | 'APPLIANCE_REPAIR' | 'CARPENTRY' | 'PAINTING' | 'CLEANING' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'STRIPE' | 'BKASH';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: Role;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  skills: string[];
  serviceAreas: string[];
  bio?: string | null;
  experience?: number | null;
  hourlyRate?: number | string | null;
  isVerified: boolean;
  isAvailable: boolean;
  currentLat?: number | null;
  currentLng?: number | null;
  rating: number;
  totalJobs: number;
  totalEarnings: number;
  user?: { id: string; fullName: string; email: string; phone?: string | null; avatarUrl?: string | null };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  priority: Priority;
  status: JobStatus;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  scheduledAt?: string | null;
  assignedAt?: string | null;
  acceptedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  estimatedCost?: number | null;
  finalCost?: number | null;
  customerId: string;
  technicianId?: string | null;
  customer?: { id: string; fullName: string; email: string; phone?: string | null };
  technician?: TechnicianProfile | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  jobId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string | null;
  stripePaymentId?: string | null;
  bkashTrxId?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors: { field?: string; message: string }[];
}

export interface JobLog {
  id: string;
  oldStatus?: JobStatus | null;
  newStatus: JobStatus;
  note?: string | null;
  createdAt: string;
}

export interface ServiceReport {
  id: string;
  summary: string;
  findings?: string | null;
  recommendations?: string | null;
  laborHours?: number | null;
  partsUsed: string[];
  createdAt: string;
}

export interface TechnicianReview {
  id: string;
  rating: number;
  punctuality: number;
  professionalism: number;
  quality: number;
  comment?: string | null;
  createdAt: string;
  reviewer?: { fullName: string; avatarUrl?: string | null };
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  purpose?: string | null;
  createdAt: string;
}

export interface JobDetail extends Job {
  payment?: Payment | null;
  review?: TechnicianReview | null;
  serviceReport?: ServiceReport | null;
  attachments: Attachment[];
  logs: JobLog[];
}

export interface PaymentWithJob extends Payment {
  job?: { id: string; title: string; category: JobCategory };
}

export interface PaymentInitiation {
  payment: Payment;
  provider: PaymentMethod;
  clientSecret?: string | null;
  bkashURL?: string;
  paymentID?: string;
}

export interface TechnicianSuggestion {
  technicianId: string;
  name: string;
  email: string;
  distanceKm: number;
  currentOpenJobs: number;
  rating: number;
  score: number;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details?: Record<string, unknown> | null;
  createdAt: string;
  user?: { fullName: string; email: string; role: Role };
}

export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  verifiedTechnicians: number;
  jobsByStatus: Record<string, number>;
  totalRevenue: number | string;
  averageTechnicianRating: number;
}

export interface AvailabilitySlot {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface MeResponse extends User {
  technician?: (TechnicianProfile & { availability: AvailabilitySlot[] }) | null;
}
