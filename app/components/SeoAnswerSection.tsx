import Link from "next/link";

type AnswerItem = {
  question: string;
  answer: string;
};

type SeoLink = {
  href: string;
  label: string;
};

type SeoAnswerSectionProps = {
  title?: string;
  intro?: string;
  items: AnswerItem[];
  links?: SeoLink[];
  className?: string;
};

export default function SeoAnswerSection({
  title = "Kurz erklärt",
  intro,
  items,
  links = [],
  className = "",
}: SeoAnswerSectionProps) {
  return (
    <section className={`rounded-xl border border-anthracite/10 bg-white p-6 shadow-[0_18px_45px_-38px_rgba(31,27,27,0.45)] ${className}`}>
      <h2 className="font-display text-2xl font-bold tracking-[-0.035em] text-anthracite">{title}</h2>
      {intro && <p className="mt-3 text-sm leading-relaxed text-anthracite/65">{intro}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.question} className="rounded-lg border border-anthracite/10 bg-offwhite/70 p-4">
            <h3 className="text-sm font-semibold text-anthracite">{item.question}</h3>
            <p className="mt-2 text-sm leading-relaxed text-anthracite/65">{item.answer}</p>
          </article>
        ))}
      </div>
      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-anthracite/10 bg-offwhite px-3 py-2 text-xs font-semibold text-ruby hover:border-ruby/30"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
