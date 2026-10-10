'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from './form-field';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api-client';
import { registerSchema, type RegisterInput } from '@/lib/validators';

export function RegisterForm() {
  const { register: signUp } = useAuth();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { role: 'CUSTOMER' },
  });

  async function submit(v: RegisterInput) {
    try {
      await signUp({ fullName: v.fullName, email: v.email, password: v.password, phone: v.phone || undefined, role: v.role });
    } catch (e) {
      if (e instanceof ApiError) {
        // Show server-side field errors next to the fields they belong to.
        e.errors.forEach((err) => err.field && setError(err.field as keyof RegisterInput, { message: err.message }));
        toast.error(e.message);
      } else toast.error('Could not create your account. Please try again.');
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Request services or offer your skills as a technician</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          <FormField id="role" label="I want to" error={errors.role?.message}>
            <Select id="role" {...register('role')}>
              <option value="CUSTOMER">Request services (Customer)</option>
              <option value="TECHNICIAN">Offer services (Technician)</option>
            </Select>
          </FormField>
          <FormField id="fullName" label="Full name" error={errors.fullName?.message}><Input id="fullName" autoComplete="name" aria-invalid={!!errors.fullName} {...register('fullName')} /></FormField>
          <FormField id="email" label="Email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} /></FormField>
          <FormField id="phone" label="Phone (optional)" error={errors.phone?.message}><Input id="phone" type="tel" autoComplete="tel" {...register('phone')} /></FormField>
          <FormField id="password" label="Password" hint="At least 8 characters" error={errors.password?.message}><Input id="password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register('password')} /></FormField>
          <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}><Input id="confirmPassword" type="password" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register('confirmPassword')} /></FormField>
          <Button type="submit" className="w-full" loading={isSubmitting}>Create account</Button>
          <p className="text-center text-sm text-muted-foreground">Already registered? <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link></p>
        </form>
      </CardContent>
    </Card>
  );
}
