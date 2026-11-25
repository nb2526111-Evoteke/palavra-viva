export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="hero-glow relative overflow-hidden border-b border-line/60 bg-surface/30">
      <div className="shell py-14 md:py-20">
        <div className="max-w-3xl">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="display mt-5 text-[clamp(2.4rem,5vw,4rem)]">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted md:text-base">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
