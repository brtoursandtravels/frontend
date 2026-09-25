import Link from "next/link";
import { ArrowRight, MapPinned, MessagesSquare, UsersRound } from "lucide-react";

const roles = [
  { icon: MessagesSquare, title: "Trip planning", text: "We help you choose where to go, when to travel and what fits your budget.", tags: "Dates · interests · budget" },
  { icon: MapPinned, title: "Hotels and transport", text: "We help plan the route, places to stay and travel between stops.", tags: "Routes · hotels · activities" },
  { icon: UsersRound, title: "Help during your trip", text: "Contact our team if you have a question or need help while travelling.", tags: "Questions · updates · help" },
] as const;

export function TeamShowcase() {
  return (
    <section className="grid grid-cols-[.8fr_1.2fr] gap-10 max-[900px]:grid-cols-1" aria-labelledby="team-title">
      <div className="self-center">
        <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">Our team</p>
        <h2 className="m-0 font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading" id="team-title">A team to help with every step.</h2>
        <p className="mt-4 text-[0.95rem] leading-7 text-text-muted">Our team works together to plan your trip, arrange the details and help with questions while you travel.</p>
        <Link className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white no-underline transition hover:-translate-y-0.5 hover:bg-primary-hover" href="/contact-us#contact-form">Talk to our team <ArrowRight aria-hidden="true" size={17} /></Link>
      </div>
      <div className="grid gap-4">
        {roles.map(({ icon: Icon, title, text, tags }) => (
          <article className="grid grid-cols-[3rem_1fr] gap-4 rounded-xl border border-border-subtle bg-white p-5 shadow-card" key={title}>
            <div className="grid size-12 place-items-center rounded-full bg-secondary-muted/55 text-secondary-hover"><Icon aria-hidden="true" size={21} /></div>
            <div><h3 className="m-0 font-display text-[1.15rem] font-semibold text-text-heading">{title}</h3><p className="mb-0 mt-2 text-[0.9rem] leading-relaxed text-text-muted">{text}</p><p className="mb-0 mt-3 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-primary">{tags}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
