import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Image src="/images/not-found.svg" alt="404 — page not found" width={520} height={300} priority className="h-auto w-full max-w-md" />
      <h1 className="mt-2 text-3xl font-extrabold">We can’t find that page</h1>
      <p className="mt-2 max-w-md text-muted-foreground">The link may be broken, or the page may have moved. Head back home and try again.</p>
      <div className="mt-8 flex gap-3"><Button asChild variant="gold"><Link href="/">Back to home</Link></Button><Button asChild variant="outline"><Link href="/contact">Contact support</Link></Button></div>
    </div>
  );
}
