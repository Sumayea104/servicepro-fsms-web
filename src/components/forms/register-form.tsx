'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, UserRound, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from './form-field';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api-client';
import { registerSchema, type RegisterInput } from '@/lib/validators';
import { cn } from '@/lib/utils';

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  return score; // 0-4
}
const LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['bg-muted', 'bg-destructive', 'bg-gold', 'bg-success/80', 'bg-success'];

export function RegisterForm() {
  const { register: signUp } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, setError, setValue, watch, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { role: 'CUSTOMER' },
  });
  const role = watch('role');
  const score = strength(watch('password') ?? '');

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

  const roles = [
    { id: 'CUSTOMER' as const, label: 'Customer', hint: 'Request repairs', icon: UserRound },
    { id: 'TECHNICIAN' as const, label: 'Technician', hint: 'Offer your skills', icon: Wrench },
  ];

  return (
    <div className="space-y-7">
      <div><h1 className="text-3xl font-extrabold">Create your account</h1><p className="mt-1.5 text-muted-foreground">Join ServicePro in under a minute.</p></div>
      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <div role="radiogroup" aria-label="Account type" className="grid grid-cols-2 gap-3">
          {roles.map((r) => (
            <button key={r.id} type="button" role="radio" aria-checked={role === r.id} onClick={() => setValue('role', r.id)}
              className={cn('flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all', role === r.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'bg-card hover:bg-accent')}>
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', role === r.id ? 'bg-primary text-primary-foreground' : 'bg-secondary')}><r.icon className="h-5 w-5" aria-hidden /></span>
              <span><span className="block text-sm font-semibold">{r.label}</span><span className="text-xs text-muted-foreground">{r.hint}</span></span>
            </button>
          ))}
        </div>
        <FormField id="fullName" label="Full name" error={errors.fullName?.message}><Input id="fullName" autoComplete="name" aria-invalid={!!errors.fullName} {...register('fullName')} /></FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="email" label="Email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} /></FormField>
          <FormField id="phone" label="Phone (optional)" error={errors.phone?.message}><Input id="phone" type="tel" autoComplete="tel" {...register('phone')} /></FormField>
        </div>
        <FormField id="password" label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input id="password" type={showPw ? 'text' : 'password'} autoComplete="new-password" className="pr-11" aria-invalid={!!errors.password} {...register('password')} />
            <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
          <div className="mt-2 flex items-center gap-2" aria-live="polite">
            <div className="flex flex-1 gap-1">{[1, 2, 3, 4].map((n) => <span key={n} className={cn('h-1.5 flex-1 rounded-full transition-colors', n <= score ? COLORS[score] : 'bg-muted')} />)}</div>
            <span className="w-16 text-right text-xs text-muted-foreground">{LABELS[score]}</span>
          </div>
        </FormField>
        <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}><Input id="confirmPassword" type={showPw ? 'text' : 'password'} autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register('confirmPassword')} /></FormField>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Create account</Button>
        <p className="text-center text-sm text-muted-foreground">Already registered? <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link></p>
      </form>
    </div>
  );
}
