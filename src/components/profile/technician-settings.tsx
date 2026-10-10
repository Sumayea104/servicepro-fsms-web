'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LocateFixed, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/form-field';
import { api, ApiError } from '@/lib/api-client';
import { JOB_CATEGORIES } from '@/lib/constants';
import { technicianProfileSchema } from '@/lib/validators';
import { z } from 'zod';
import type { AvailabilitySlot, TechnicianProfile } from '@/types/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
type SkillsInput = z.infer<typeof technicianProfileSchema>;

function useSave<T>(fn: (v: T) => Promise<unknown>, success: string) {
  const router = useRouter();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => { toast.success(success); router.refresh(); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not save'),
  });
}

export function TechnicianSettings({ profile }: { profile: TechnicianProfile & { availability: AvailabilitySlot[] } }) {
  const [available, setAvailable] = useState(profile.isAvailable);
  const [slots, setSlots] = useState<AvailabilitySlot[]>(profile.availability.length ? profile.availability : [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }]);

  const toggle = useSave((v: boolean) => api('/technicians/me/availability', { method: 'PATCH', body: { isAvailable: v } }), 'Availability updated');
  const skills = useSave((v: SkillsInput) => api('/technicians/me/skills', { method: 'PATCH', body: { skills: v.skills.split(',').map((s) => s.trim().toUpperCase().replace(/\s+/g, '_')).filter(Boolean), serviceAreas: (v.serviceAreas ?? '').split(',').map((s) => s.trim()).filter(Boolean) } }), 'Skills saved');
  const weekly = useSave(() => api('/technicians/me/weekly-availability', { method: 'PUT', body: { slots: slots.map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime })) } }), 'Weekly schedule saved');
  const location = useSave((c: { currentLat: number; currentLng: number }) => api('/technicians/me/location', { method: 'PATCH', body: c }), 'Location updated');

  const { register, handleSubmit, formState: { errors } } = useForm<SkillsInput>({
    resolver: zodResolver(technicianProfileSchema),
    defaultValues: { skills: profile.skills.join(', '), serviceAreas: profile.serviceAreas.join(', ') },
  });

  function useMyLocation() {
    if (!navigator.geolocation) return toast.error('Your browser does not support location');
    navigator.geolocation.getCurrentPosition(
      (pos) => location.mutate({ currentLat: pos.coords.latitude, currentLng: pos.coords.longitude }),
      () => toast.error('Location permission was denied'),
    );
  }

  const update = (i: number, patch: Partial<AvailabilitySlot>) => setSlots((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Availability</CardTitle><CardDescription>{profile.isVerified ? 'Your profile is verified — dispatchers can assign you jobs.' : 'Awaiting admin verification. You won’t receive assignments until approved.'}</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div><Label htmlFor="avail">Accepting new jobs</Label><p className="text-xs text-muted-foreground">Turn off when you’re on leave.</p></div>
            <Switch id="avail" checked={available} disabled={toggle.isPending} onCheckedChange={(v) => { setAvailable(v); toggle.mutate(v, { onError: () => setAvailable(!v) }); }} />
          </div>
          <Button type="button" variant="outline" size="sm" loading={location.isPending} onClick={useMyLocation}><LocateFixed className="h-4 w-4" /> Update my current location</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Skills &amp; service areas</CardTitle><CardDescription>Dispatchers match jobs using these skills.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((v) => skills.mutate(v))} className="space-y-4" noValidate>
            <FormField id="skills" label="Skills" hint={`Comma separated. Options: ${JOB_CATEGORIES.join(', ')}`} error={errors.skills?.message}><Input id="skills" aria-invalid={!!errors.skills} {...register('skills')} /></FormField>
            <FormField id="serviceAreas" label="Service areas" hint="e.g. Dhanmondi, Gulshan"><Input id="serviceAreas" {...register('serviceAreas')} /></FormField>
            <Button type="submit" loading={skills.isPending}>Save skills</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Weekly schedule</CardTitle><CardDescription>The hours you normally work.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {slots.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_8rem_8rem_auto]">
              <Select aria-label="Day" value={s.dayOfWeek} onChange={(e) => update(i, { dayOfWeek: Number(e.target.value) })}>{DAYS.map((d, n) => <option key={d} value={n}>{d}</option>)}</Select>
              <Input aria-label="Start time" type="time" value={s.startTime} onChange={(e) => update(i, { startTime: e.target.value })} />
              <Input aria-label="End time" type="time" value={s.endTime} onChange={(e) => update(i, { endTime: e.target.value })} />
              <Button type="button" variant="ghost" size="icon" aria-label="Remove slot" disabled={slots.length === 1} onClick={() => setSlots((x) => x.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setSlots((x) => [...x, { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }])}><Plus className="h-4 w-4" /> Add day</Button>
            <Button type="button" size="sm" loading={weekly.isPending} onClick={() => weekly.mutate(undefined)}>Save schedule</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
