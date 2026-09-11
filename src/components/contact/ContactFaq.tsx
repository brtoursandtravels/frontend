import { Plus } from "lucide-react";

const questions = [
  {
    question: "Is there any charge for preparing a custom itinerary?",
    answer: "No. Your initial consultation and first custom proposal are complimentary, with no obligation to book.",
  },
  {
    question: "How far in advance should I start planning?",
    answer: "For peak winter travel and wildlife safaris, planning two to four months ahead gives you the strongest choice of stays and permits. We can also help with closer dates, subject to availability.",
  },
  {
    question: "Can I modify the route after receiving the first draft?",
    answer: "Yes. We can refine the pacing, stays and private experiences until the proposal feels right for you.",
  },
] as const;

export function ContactFaq() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8" aria-labelledby="contact-faq-title">
      <div className="grid grid-cols-[0.55fr_1.45fr] gap-12 max-[820px]:grid-cols-1 max-[820px]:gap-7">
        <header>
          <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-secondary-hover">Before you plan</p>
          <h2 className="m-0 text-balance font-display text-[clamp(1.75rem,2.5vw,2.5rem)] font-semibold leading-[1.1] text-text-heading" id="contact-faq-title">A few reassuring answers.</h2>
        </header>
        <div className="border-t border-border-subtle">
          {questions.map((item) => (
            <details className="group border-b border-border-subtle py-1" key={item.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[0.95rem] font-extrabold text-text-heading [&::-webkit-details-marker]:hidden">
                {item.question}<Plus aria-hidden="true" className="shrink-0 text-secondary transition group-open:rotate-45" size={18} />
              </summary>
              <p className="mb-5 mt-0 max-w-2xl text-[0.88rem] leading-relaxed text-text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
