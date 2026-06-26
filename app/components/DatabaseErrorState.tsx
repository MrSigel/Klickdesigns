import Link from "next/link";

type DatabaseErrorStateProps = {
  className?: string;
};

export default function DatabaseErrorState({ className = "" }: DatabaseErrorStateProps) {
  return (
    <div
      className={`rounded-xl border border-ruby/15 bg-white p-7 text-center shadow-[0_18px_45px_-36px_rgba(31,27,27,0.45)] sm:p-9 ${className}`}
    >
      <h2 className="font-display text-2xl font-bold tracking-[-0.035em] text-anthracite sm:text-3xl">
        Aktuell ist ein technisches Problem aufgetreten
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-anthracite/70 sm:text-base">
        Bitte kontaktiere uns per E-Mail:{" "}
        <a href="mailto:kontakt@klickdesigns.de" className="font-semibold text-ruby hover:text-anthracite">
          kontakt@klickdesigns.de
        </a>
        . Aktuell arbeiten wir an der Website.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-ruby px-5 py-3 text-sm font-semibold text-offwhite transition-all hover:-translate-y-0.5 hover:bg-ruby/90"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
