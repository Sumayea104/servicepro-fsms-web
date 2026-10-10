'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Camera, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/form-field';
import { api, ApiError, uploadWithProgress } from '@/lib/api-client';
import { profileSchema, type ProfileInput } from '@/lib/validators';
import { humanize } from '@/lib/utils';
import type { User } from '@/types/api';

function AvatarUploader({ user }: { user: User }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function onPick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file');
    if (file.size > 5 * 1024 * 1024) return toast.error('Images must be 5 MB or smaller');
    setPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('avatar', file);
    setProgress(0);
    try {
      await uploadWithProgress('/users/me/avatar', fd, setProgress);
      toast.success('Profile photo updated');
      router.refresh();
    } catch (e) {
      setPreview(null);
      toast.error(e instanceof ApiError ? e.message : 'Upload failed');
    } finally {
      setProgress(null);
    }
  }

  const src = preview ?? user.avatarUrl;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-muted">
        {src ? <Image src={src} alt={`${user.fullName}’s photo`} fill sizes="80px" className="object-cover" unoptimized={!!preview} /> : <UserRound className="m-5 h-10 w-10 text-muted-foreground" aria-hidden />}
      </div>
      <div className="space-y-2">
        <input ref={input} type="file" accept="image/*" className="sr-only" aria-label="Upload profile photo" onChange={(e) => onPick(e.target.files?.[0])} />
        <Button type="button" variant="outline" size="sm" loading={progress !== null} onClick={() => input.current?.click()}><Camera className="h-4 w-4" /> {progress !== null ? `Uploading ${progress}%` : 'Change photo'}</Button>
        <p className="text-xs text-muted-foreground">JPG or PNG, up to 5 MB</p>
      </div>
    </div>
  );
}

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: { fullName: user.fullName, phone: user.phone ?? '' },
  });

  const save = useMutation({
    mutationFn: (v: ProfileInput) => api<User>('/users/me', { method: 'PATCH', body: { fullName: v.fullName, phone: v.phone || undefined } }),
    onSuccess: (u) => {
      toast.success('Profile saved');
      reset({ fullName: u.fullName, phone: u.phone ?? '' });
      router.refresh();
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not save your profile'),
  });

  return (
    <Card>
      <CardHeader><CardTitle>Profile</CardTitle><CardDescription>{user.email} · {humanize(user.role)}</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <AvatarUploader user={user} />
        <form onSubmit={handleSubmit((v) => save.mutate(v))} className="space-y-4" noValidate>
          <FormField id="fullName" label="Full name" error={errors.fullName?.message}><Input id="fullName" aria-invalid={!!errors.fullName} {...register('fullName')} /></FormField>
          <FormField id="phone" label="Phone" error={errors.phone?.message}><Input id="phone" type="tel" {...register('phone')} /></FormField>
          <Button type="submit" loading={save.isPending} disabled={!isDirty}>Save changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}
