'use client';

import { Select } from '@/components/ui/input';
import { PromptDialog } from '@/components/jobs/prompt-dialog';
import { useJobAction } from '@/hooks/use-job-action';
import { useAuthStore } from '@/store/auth-store';
import type { AdminUser, Role } from '@/types/api';

export function UserActions({ user }: { user: AdminUser }) {
  const me = useAuthStore((s) => s.user);
  const role = useJobAction<{ role: Role }>({ path: `/admin/users/${user.id}/role`, method: 'PATCH', success: 'Role updated' });
  const remove = useJobAction({ path: `/admin/users/${user.id}`, method: 'DELETE', success: 'User deactivated' });
  const isSelf = me?.id === user.id;

  return (
    <div className="flex items-center gap-2">
      <Select aria-label={`Role for ${user.fullName}`} className="h-9 w-36" value={user.role} disabled={isSelf || role.isPending} onChange={(e) => role.mutate({ role: e.target.value as Role })}>
        <option value="CUSTOMER">Customer</option><option value="TECHNICIAN">Technician</option><option value="ADMIN">Admin</option>
      </Select>
      {!isSelf && user.isActive && (
        <PromptDialog trigger="Deactivate" title={`Deactivate ${user.fullName}?`} description="They will no longer be able to sign in. Type a note for your records if needed." label="Note (optional)" confirmLabel="Deactivate" confirmVariant="destructive" pending={remove.isPending} onConfirm={() => remove.mutate(undefined)} />
      )}
    </div>
  );
}
