import Link from 'next/link';
import { Logo } from './logo';

const COLS = [
  { title: 'Platform', links: [['Services', '/services'], ['Technicians', '/technicians'], ['FAQ', '/faq']] },
  { title: 'Company', links: [['About', '/about'], ['Contact', '/contact']] },
  { title: 'Account', links: [['Log in', '/login'], ['Create account', '/register']] },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-gradient text-white">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">Dispatch-managed field service: verified technicians, conflict-free scheduling and transparent payments, from request to receipt.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/45">{c.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {c.links.map(([label, href]) => <li key={href}><Link href={href} className="text-white/70 transition-colors hover:text-gold">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">© {new Date().getFullYear()} ServicePro FSMS · Built for dependable field service</div>
    </footer>
  );
}
