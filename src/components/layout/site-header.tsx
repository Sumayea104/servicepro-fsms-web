import Link from 'next/link';
import { cookies } from 'next/headers';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACCESS_COOKIE, REFRESH_COOKIE, ROLE_HOME } from '@/lib/constants';
import { decodeToken, isExpired } from '@/lib/jwt';
import { MobileNav } from './mobile-nav';

export const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export async function SiteHeader() {
  const jar = await cookies();
  const claims = decodeToken(jar.get(ACCESS_COOKIE)?.value) ?? decodeToken(jar.get(REFRESH_COOKIE)?.value);
  const loggedIn = !isExpired(claims);
  const home = loggedIn ? ROLE_HOME[claims!.role] : null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="rounded-lg bg-primary p-1.5 text-primary-foreground"><Wrench className="h-5 w-5" aria-hidden /></span>
          ServicePro
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Main">
          {PUBLIC_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {home ? (
            <Button asChild><Link href={home}>Go to dashboard</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/login">Log in</Link></Button>
              <Button asChild><Link href="/register">Get started</Link></Button>
            </>
          )}
        </div>
        <MobileNav links={PUBLIC_LINKS} dashboardHref={home} />
      </div>
    </header>
  );
}
