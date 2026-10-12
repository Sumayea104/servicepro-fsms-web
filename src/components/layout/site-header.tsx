import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { ACCESS_COOKIE, REFRESH_COOKIE, ROLE_HOME } from '@/lib/constants';
import { decodeToken, isExpired } from '@/lib/jwt';
import { Logo } from './logo';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';

export const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/technicians', label: 'Technicians' },
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
    <header className="glass sticky top-0 z-40 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Main">
          {PUBLIC_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {home ? (
            <Button asChild variant="gold"><Link href={home}>Dashboard</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/login">Log in</Link></Button>
              <Button asChild variant="gold"><Link href="/register">Get started</Link></Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 md:hidden"><ThemeToggle compact /><MobileNav links={PUBLIC_LINKS} dashboardHref={home} /></div>
      </div>
    </header>
  );
}
