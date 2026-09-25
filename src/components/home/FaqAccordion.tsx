import { SectionHeader } from "@/components/common/SectionHeader";

type Faq = { id: string; question: string; answer: string; sortOrder: number; isDemo: boolean };

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section className="defer-render mx-auto grid w-full max-w-7xl grid-cols-[0.75fr_1.25fr] items-start gap-16 px-5 py-24 sm:px-8 lg:px-10 max-[820px]:grid-cols-1 max-[820px]:py-[4.5rem]">
      <div className="w-full self-start text-left [&_header]:items-start [&_header]:text-left [&_header>div]:mx-0">
        <SectionHeader
          align="left"
          eyebrow="Common questions"
          title="Questions about planning a trip?"
          description="Find answers to questions travellers often ask before booking."
        />
      </div>
      <div className="border-t border-border-subtle">
        {faqs.map((faq, index) => (
          <details className="group border-b border-border-subtle" key={faq.id} open={index === 0}>
            <summary className="grid list-none grid-cols-[2rem_1fr_1rem] items-center gap-4 py-5 text-[0.95rem] font-bold leading-snug text-text-heading marker:hidden"><span className="text-xs font-extrabold text-secondary-hover">{String(index + 1).padStart(2, "0")}</span>{faq.question}<i className="relative size-4 before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-primary after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-primary after:transition-transform group-open:after:rotate-90" aria-hidden="true" /></summary>
            <p className="mb-6 ml-12 max-w-2xl text-[0.95rem] leading-relaxed text-text-muted max-[620px]:ml-0">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
