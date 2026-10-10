'use client';

import { Button } from '@/components/ui/button';
import { PromptDialog } from '@/components/jobs/prompt-dialog';
import { useJobAction } from '@/hooks/use-job-action';

export function TechnicianVerifyActions({ id }: { id: string }) {
  const verify = useJobAction<{ decision: 'APPROVE' | 'REJECT'; rejectionReason?: string }>({ path: `/admin/technicians/${id}/verify`, method: 'PATCH', success: 'Decision recorded' });
  return (
    <div className="flex gap-2">
      <Button size="sm" loading={verify.isPending} onClick={() => verify.mutate({ decision: 'APPROVE' })}>Verify</Button>
      <PromptDialog trigger="Reject" title="Reject this technician?" description="They’ll be told why." label="Reason" required confirmLabel="Reject" confirmVariant="destructive" pending={verify.isPending}
        onConfirm={(reason) => verify.mutate({ decision: 'REJECT', rejectionReason: reason })} />
    </div>
  );
}
