import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/forms/login-form';

export const metadata: Metadata = { title: 'Log in', description: 'Log in to your ServicePro account or try a one-click demo.' };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
