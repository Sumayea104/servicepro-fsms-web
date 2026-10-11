import Image from 'next/image';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-brand-gradient lg:block">
        <Image src="/images/auth-art.svg" alt="" fill priority sizes="50vw" className="object-cover object-center" />
        <div className="absolute left-10 top-9"><Logo light /></div>
        <div className="absolute inset-x-10 bottom-10 text-white">
          <h2 className="text-3xl font-extrabold leading-tight">Service work, <span className="text-gradient">under control.</span></h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">Request, dispatch, schedule, complete and pay — with a clear timeline and an audit trail at every step.</p>
        </div>
      </aside>
      <main className="relative flex flex-col items-center justify-center px-4 py-12">
        <div className="absolute right-4 top-4"><ThemeToggle /></div>
        <div className="mb-8 lg:hidden"><Logo /></div>
        <div className="w-full max-w-md animate-fade-up">{children}</div>
      </main>
    </div>
  );
}
