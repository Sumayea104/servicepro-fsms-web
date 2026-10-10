'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea, Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PromptDialogProps {
  trigger: string;
  triggerVariant?: ButtonProps['variant'];
  title: string;
  description?: string;
  label: string;
  confirmLabel: string;
  confirmVariant?: ButtonProps['variant'];
  required?: boolean;
  type?: 'text' | 'number';
  pending: boolean;
  onConfirm: (value: string) => void;
  closeSignal?: boolean;
}

/** Small confirm-with-input dialog used for cancel reasons, rejection reasons and final cost entry. */
export function PromptDialog({ trigger, triggerVariant = 'outline', title, description, label, confirmLabel, confirmVariant = 'default', required, type = 'text', pending, onConfirm }: PromptDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const invalid = required && (!value.trim() || (type === 'number' && !(Number(value) > 0)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant={triggerVariant}>{trigger}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle>{description && <DialogDescription>{description}</DialogDescription>}</DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="prompt-value">{label}</Label>
          {type === 'number' ? <Input id="prompt-value" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} /> : <Textarea id="prompt-value" value={value} onChange={(e) => setValue(e.target.value)} />}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Back</Button>
          <Button variant={confirmVariant} loading={pending} disabled={invalid} onClick={() => { onConfirm(value.trim()); setOpen(false); setValue(''); }}>{confirmLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
