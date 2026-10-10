'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ImagePlus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiError, uploadWithProgress } from '@/lib/api-client';

export function AttachmentUploader({ jobId, purpose }: { jobId: string; purpose: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  function pick(f: File | undefined) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(f ?? null);
    setPreview(f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
  }

  async function upload() {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error('Files must be 10 MB or smaller');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('purpose', purpose);
    setProgress(0);
    try {
      await uploadWithProgress(`/jobs/${jobId}/attachments`, fd, setProgress);
      toast.success('File uploaded');
      pick(undefined);
      if (input.current) input.current.value = '';
      router.refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Upload failed');
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex flex-wrap items-center gap-3">
        <input ref={input} id={`file-${jobId}`} type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()}><ImagePlus className="h-4 w-4" /> Choose file</Button>
        <span className="truncate text-sm text-muted-foreground">{file ? file.name : 'Images or PDF, up to 10 MB'}</span>
      </div>
      {preview && <Image src={preview} alt="Selected file preview" width={160} height={160} unoptimized className="h-32 w-auto rounded-md border object-cover" />}
      {progress !== null && (
        <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <Button type="button" size="sm" disabled={!file || progress !== null} loading={progress !== null} onClick={upload}><Upload className="h-4 w-4" /> {progress !== null ? `Uploading ${progress}%` : 'Upload'}</Button>
    </div>
  );
}
