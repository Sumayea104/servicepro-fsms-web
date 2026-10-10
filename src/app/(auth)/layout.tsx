import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2 text-lg font-bold">
        <span className="rounded-lg bg-primary p-1.5 text-primary-foreground"><Wrench className="h-5 w-5" aria-hidden /></span> ServicePro
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
