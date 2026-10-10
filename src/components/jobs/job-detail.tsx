import Image from 'next/image';
import { Calendar, FileText, MapPin, Paperclip, Star, User, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDateTime, humanize } from '@/lib/utils';
import type { JobDetail } from '@/types/api';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div className="grid gap-1 py-2 sm:grid-cols-3"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-sm sm:col-span-2">{children}</dd></div>);
}

export function JobDetailView({ job, showCustomer }: { job: JobDetail; showCustomer?: boolean }) {
  const tech = job.technician;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2"><StatusBadge status={job.status} /><StatusBadge status={job.priority} /></div>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{job.description}</p>
            <dl className="mt-6 divide-y">
              <Row label="Category">{humanize(job.category)}</Row>
              <Row label="Address"><span className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />{job.address}</span></Row>
              <Row label="Scheduled"><span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" aria-hidden />{formatDateTime(job.scheduledAt)}</span></Row>
              <Row label="Estimated cost">{formatCurrency(job.estimatedCost)}</Row>
              <Row label="Final cost">{formatCurrency(job.finalCost)}</Row>
              {showCustomer && job.customer && <Row label="Customer">{job.customer.fullName} · {job.customer.email}{job.customer.phone ? ` · ${job.customer.phone}` : ''}</Row>}
              {job.cancellationReason && <Row label="Cancellation reason">{job.cancellationReason}</Row>}
            </dl>
          </CardContent>
        </Card>

        {job.serviceReport && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" aria-hidden /> Service report</CardTitle></CardHeader>
            <CardContent>
              <dl className="divide-y">
                <Row label="Summary">{job.serviceReport.summary}</Row>
                {job.serviceReport.findings && <Row label="Findings">{job.serviceReport.findings}</Row>}
                {job.serviceReport.recommendations && <Row label="Recommendations">{job.serviceReport.recommendations}</Row>}
                {job.serviceReport.laborHours != null && <Row label="Labour">{job.serviceReport.laborHours} hours</Row>}
                {job.serviceReport.partsUsed.length > 0 && <Row label="Parts used">{job.serviceReport.partsUsed.join(', ')}</Row>}
              </dl>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Paperclip className="h-5 w-5" aria-hidden /> Attachments</CardTitle></CardHeader>
          <CardContent>
            {job.attachments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files attached yet.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {job.attachments.map((a) => (
                  <li key={a.id} className="overflow-hidden rounded-lg border">
                    {a.fileType.startsWith('image/') ? (
                      <a href={a.fileUrl} target="_blank" rel="noreferrer"><Image src={a.fileUrl} alt={a.fileName} width={400} height={240} className="h-40 w-full object-cover" /></a>
                    ) : (
                      <a href={a.fileUrl} target="_blank" rel="noreferrer" className="flex h-40 items-center justify-center bg-muted text-sm text-primary hover:underline"><FileText className="mr-2 h-5 w-5" aria-hidden />Open document</a>
                    )}
                    <div className="p-2 text-xs"><p className="truncate font-medium">{a.fileName}</p>{a.purpose && <p className="text-muted-foreground">{humanize(a.purpose.replace(/-/g, '_'))}</p>}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" aria-hidden /> Technician</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {tech ? (
              <div className="space-y-1"><p className="font-medium">{tech.user?.fullName}</p><p className="text-muted-foreground">{tech.user?.phone ?? tech.user?.email}</p>
                <p className="flex items-center gap-1 text-muted-foreground"><Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />{tech.rating.toFixed(1)} · {tech.totalJobs} jobs</p></div>
            ) : <p className="text-muted-foreground">Not assigned yet.</p>}
          </CardContent>
        </Card>

        {job.payment && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Wallet className="h-5 w-5" aria-hidden /> Payment</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={job.payment.status} /></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">{formatCurrency(job.payment.amount, job.payment.currency)}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Method</span><span>{humanize(job.payment.method)}</span></div>
            </CardContent>
          </Card>
        )}

        {job.review && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Customer review</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="flex items-center gap-1 font-medium"><Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />{job.review.rating}/5</p>
              <p className="text-muted-foreground">Punctuality {job.review.punctuality} · Professionalism {job.review.professionalism} · Quality {job.review.quality}</p>
              {job.review.comment && <p className="pt-1">“{job.review.comment}”</p>}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-lg">Timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l pl-5">
              {job.logs.map((l) => (
                <li key={l.id} className="relative">
                  <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
                  <StatusBadge status={l.newStatus} />
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(l.createdAt)}</p>
                  {l.note && <p className="mt-0.5 text-sm">{l.note}</p>}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
