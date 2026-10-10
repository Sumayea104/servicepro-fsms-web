'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from './form-field';
import { contactSchema, type ContactInput } from '@/lib/validators';

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), mode: 'onChange' });

  // There is no contact endpoint on the API, so this hands the message to the visitor's own mail client
  // addressed to support — it genuinely sends nothing itself and doesn't pretend to.
  function onSubmit(v: ContactInput) {
    const body = `${v.message}\n\n— ${v.name} (${v.email})`;
    window.location.href = `mailto:support@servicepro.com?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(body)}`;
    toast.success('Opening your email app to send this message');
    reset();
  }

  return (
    <Card><CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField id="name" label="Your name" error={errors.name?.message}><Input id="name" aria-invalid={!!errors.name} {...register('name')} /></FormField>
        <FormField id="email" label="Email" error={errors.email?.message}><Input id="email" type="email" aria-invalid={!!errors.email} {...register('email')} /></FormField>
        <FormField id="subject" label="Subject" error={errors.subject?.message}><Input id="subject" aria-invalid={!!errors.subject} {...register('subject')} /></FormField>
        <FormField id="message" label="Message" error={errors.message?.message}><Textarea id="message" aria-invalid={!!errors.message} {...register('message')} /></FormField>
        <Button type="submit" className="w-full" loading={isSubmitting}>Send message</Button>
      </form>
    </CardContent></Card>
  );
}
