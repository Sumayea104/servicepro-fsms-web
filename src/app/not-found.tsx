import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-5 text-primary"><Compass className="h-10 w-10" aria-hidden /></div>
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold">We can’t find that page</h1>
      <p className="mt-2 max-w-md text-muted-foreground">The link may be broken, or the page may have moved. Head back home and try again.</p>
      <div className="mt-8 flex gap-3"><Button asChild><Link href="/">Back to home</Link></Button><Button asChild variant="outline"><Link href="/contact">Contact support</Link></Button></div>
    </div>
  );
}
