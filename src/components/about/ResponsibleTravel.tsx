import { HandHeart, Leaf, Store } from "lucide-react";

const commitments = [
  { icon: Store, title: "Support local people", text: "Where possible, we choose local guides, activities and places to stay." },
  { icon: Leaf, title: "Reduce waste", text: "Carry a reusable water bottle, avoid extra plastic and leave each place clean." },
  { icon: HandHeart, title: "Respect local customs", text: "Follow local customs, care for nature and be respectful to the people you meet." },
] as const;

export function ResponsibleTravel() {
  return (
    <section className="overflow-hidden rounded-xl border border-success/20 bg-[linear-gradient(125deg,#edf6ef,#faf7f2)] p-[clamp(1.5rem,4vw,3.5rem)]" aria-labelledby="responsible-title">
      <p className="mb-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-success">Travel with care</p>
      <h2 className="m-0 whitespace-nowrap font-display text-[clamp(1.85rem,3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text-heading max-[900px]:whitespace-normal" id="responsible-title">Care for the places you visit.</h2>
      <div className="mt-8 grid grid-cols-3 gap-5 max-[760px]:grid-cols-1">
        {commitments.map(({ icon: Icon, title, text }) => (
          <article className="rounded-lg border border-success/15 bg-white/75 p-5" key={title}><Icon className="text-success" aria-hidden="true" size={24} /><h3 className="mb-0 mt-4 font-display text-[1.15rem] font-semibold text-text-heading">{title}</h3><p className="mb-0 mt-2 text-[0.9rem] leading-relaxed text-text-muted">{text}</p></article>
        ))}
      </div>
    </section>
  );
}
