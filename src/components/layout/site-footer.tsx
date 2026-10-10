import Link from 'next/link';
import { Wrench } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold"><Wrench className="h-5 w-5 text-primary" aria-hidden /> ServicePro</Link>
          <p className="mt-3 text-sm text-muted-foreground">Dispatch-managed field service: verified technicians, scheduled visits, transparent payments.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/services" className="hover:text-foreground">Electrical &amp; AC repair</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Plumbing &amp; appliances</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Carpentry &amp; painting</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Get started</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/register" className="hover:text-foreground">Create an account</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Log in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} ServicePro FSMS. All rights reserved.</div>
    </footer>
  );
}
