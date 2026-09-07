import { Check, X } from "lucide-react";

export function InclusionsExclusions({
  inclusions,
  exclusions,
}: {
  inclusions: string[];
  exclusions: string[];
}) {
  return (
    <div className="grid grid-cols-2 gap-5 max-[820px]:grid-cols-1">
      <section className="rounded-lg bg-success-bg p-5">
        <h2 className="mt-0 font-display text-2xl text-text-heading">What is included</h2>
        {inclusions.length ? (
          <ul className="m-0 grid list-none gap-3 p-0">{inclusions.map((entry) => <li className="flex items-start gap-2 text-sm" key={entry}><Check className="mt-0.5 shrink-0 text-success" aria-hidden="true" size={17} />{entry}</li>)}</ul>
        ) : <p>Confirm inclusions during your enquiry.</p>}
      </section>
      <section className="rounded-lg bg-danger-bg p-5">
        <h2 className="mt-0 font-display text-2xl text-text-heading">What is not included</h2>
        {exclusions.length ? (
          <ul className="m-0 grid list-none gap-3 p-0">{exclusions.map((entry) => <li className="flex items-start gap-2 text-sm" key={entry}><X className="mt-0.5 shrink-0 text-danger" aria-hidden="true" size={17} />{entry}</li>)}</ul>
        ) : <p>Confirm exclusions during your enquiry.</p>}
      </section>
    </div>
  );
}
