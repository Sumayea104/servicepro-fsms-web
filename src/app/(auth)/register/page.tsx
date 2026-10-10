import type { Metadata } from 'next';
import { RegisterForm } from '@/components/forms/register-form';

export const metadata: Metadata = { title: 'Create account', description: 'Create a ServicePro account as a customer or technician.' };

export default function RegisterPage() {
  return <RegisterForm />;
}
