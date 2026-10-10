'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    toast.error(error.message || 'Failed to load this page');
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center" role="alert">
      <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive"><AlertTriangle className="h-8 w-8" aria-hidden /></div>
      <h2 className="text-xl font-semibold">We couldn’t load this page</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{error.message || 'The API may be temporarily unavailable.'}</p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  );
}
