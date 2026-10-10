import type { Metadata } from 'next';
import { Clock, Mail, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the ServicePro team.',
  openGraph: { title: 'Contact ServicePro', description: 'Questions about a request, a payment or becoming a technician? Write to us.' },
};

export default function ContactPage() {
  return (
    <div className="container grid max-w-5xl gap-10 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-3 text-muted-foreground">Questions about a request, a payment, or becoming a technician? Send us a message and we’ll get back to you.</p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" aria-hidden /> support@servicepro.com</li>
          <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" aria-hidden /> Sat–Thu, 9:00 am – 6:00 pm (BST)</li>
          <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" aria-hidden /> Dhaka, Bangladesh</li>
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
