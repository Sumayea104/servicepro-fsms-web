'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Rocket, ShieldCheck, User as UserIcon, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from './form-field';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api-client';
import { DEMO_ACCOUNTS } from '@/lib/constants';
import { loginSchema, type LoginInput } from '@/lib/validators';
import type { Role } from '@/types/api';

const ROLE_ICON = { ADMIN: ShieldCheck, CUSTOMER: UserIcon, TECHNICIAN: Wrench } as const;

export function LoginForm() {
  const { login } = useAuth();
  const next = useSearchParams().get('next');
  const [demoLoading, setDemoLoading] = useState<Role | null>(null);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: 'onChange' });

  async function submit(v: LoginInput) {
    try {
      await login(v.email, v.password, next);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not log in. Please try again.');
    }
  }

  async function demo(role: Role) {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role)!;
    setDemoLoading(role);
    try {
      await login(account.email, account.password);
    } catch (e) {
      toast.error(e instanceof ApiError ? `Demo login failed: ${e.message}` : 'Demo login failed. Is the API reachable?');
      setDemoLoading(null);
    }
  }

  return (
    <div className="space-y-7">
      <div><h1 className="text-3xl font-extrabold">Welcome back</h1><p className="mt-1.5 text-muted-foreground">Log in to continue to your workspace.</p></div>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          <FormField id="email" label="Email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} />
          </FormField>
          <FormField id="password" label="Password" error={errors.password?.message}>
            <div className="relative"><Input id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" className="pr-11" aria-invalid={!!errors.password} {...register('password')} /><button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
          </FormField>
          <Button type="submit" className="w-full" loading={isSubmitting}>Log in</Button>
        </form>

        <div className="relative text-center text-xs uppercase text-muted-foreground">
          <span className="absolute inset-x-0 top-1/2 border-t" aria-hidden />
          <span className="relative bg-background px-3">or</span>
        </div>

        <div>
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold"><Rocket className="h-4 w-4 text-gold" aria-hidden /> Quick demo login</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {DEMO_ACCOUNTS.map((a) => {
              const Icon = ROLE_ICON[a.role];
              return (
                <div key={a.role} className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center shadow-soft transition-shadow hover:shadow-lift">
                  <Icon className="h-6 w-6 text-primary" aria-hidden />
                  <p className="text-sm font-semibold">{a.label}</p>
                  <Button type="button" size="sm" variant="outline" className="w-full" loading={demoLoading === a.role} disabled={demoLoading !== null} onClick={() => demo(a.role)} aria-label={`Demo login as ${a.label}`}>
                    Demo login
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New here? <Link href="/register" className="font-medium text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
