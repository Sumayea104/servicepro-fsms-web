import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers about requesting a service, technician assignment, scheduling, payments and cancellations.',
  openGraph: { title: 'ServicePro FAQ', description: 'Common questions about how ServicePro works.' },
};

const FAQS = [
  { q: 'How does a request get assigned?', a: 'A dispatcher reviews your request and assigns a verified technician whose skills match the job, considering their distance, current workload and rating. You’re notified as soon as someone is assigned.' },
  { q: 'Can I choose my own technician?', a: 'Requests are assigned by a dispatcher so scheduling stays conflict-free. You can see your technician’s profile and past reviews once they’re assigned.' },
  { q: 'When do I pay?', a: 'After the technician marks the job as completed. You can pay by card (Stripe) or bKash from your Payments page or the job details page.' },
  { q: 'Which payment methods are supported?', a: 'Card payments through Stripe (USD) and bKash (BDT). There is no cash-on-delivery or pay-later option.' },
  { q: 'Can I cancel a request?', a: 'Yes — you can cancel any job that hasn’t started work yet from its details page. Add a short reason so the team understands.' },
  { q: 'How do I become a technician?', a: 'Register with the Technician role, then add your skills and service areas in your profile. An administrator verifies your account before you can receive jobs.' },
  { q: 'Can I rate my technician?', a: 'Yes. Once a job is completed you can rate punctuality, professionalism and quality, and leave a comment.' },
];

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="text-4xl font-bold tracking-tight">Frequently asked questions</h1>
      <div className="mt-8 divide-y rounded-xl border">
        {FAQS.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {f.q}<span className="text-xl text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
