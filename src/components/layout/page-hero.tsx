export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-brand-gradient text-white">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden />
      <div className="container relative py-14 sm:py-16">
        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
