import type { Metadata } from 'next';
import { Clock, Mail, MapPin } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the ServicePro team.',
  openGraph: { title: 'Contact ServicePro', description: 'Questions about a request, a payment or becoming a technician? Write to us.' },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="We’re here to help" description="Questions about a request, a payment, or becoming a technician? Send us a message." />
      <div className="container grid max-w-5xl gap-10 py-14 md:grid-cols-2">
      <div>
        <ul className="space-y-5 text-sm">
          <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" aria-hidden /> support@servicepro.com</li>
          <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" aria-hidden /> Sat–Thu, 9:00 am – 6:00 pm (BST)</li>
          <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" aria-hidden /> Dhaka, Bangladesh</li>
        </ul>
      </div>
      <ContactForm />
      </div>
    </>
  );
}
