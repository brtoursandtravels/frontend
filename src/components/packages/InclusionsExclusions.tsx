import { Check, X } from "lucide-react";

export function InclusionsExclusions({
  inclusions,
  exclusions,
}: {
  inclusions: string[];
  exclusions: string[];
}) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-6 @max-[42rem]:grid-cols-1">
        <section className="rounded-lg bg-success-bg p-6 @max-[26rem]:p-5">
          <h2 className="mb-4 mt-0 font-display text-2xl leading-tight text-text-heading">What is included</h2>
          {inclusions.length ? (
            <ul className="m-0 grid list-none gap-3 p-0">
              {inclusions.map((entry) => (
                <li className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-2.5 text-sm leading-6" key={entry}>
                  <Check className="mt-1 shrink-0 text-success" aria-hidden="true" size={17} />
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          ) : <p>Confirm inclusions during your enquiry.</p>}
        </section>
        <section className="rounded-lg bg-danger-bg p-6 @max-[26rem]:p-5">
          <h2 className="mb-4 mt-0 font-display text-2xl leading-tight text-text-heading">What is not included</h2>
          {exclusions.length ? (
            <ul className="m-0 grid list-none gap-3 p-0">
              {exclusions.map((entry) => (
                <li className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-2.5 text-sm leading-6" key={entry}>
                  <X className="mt-1 shrink-0 text-danger" aria-hidden="true" size={17} />
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          ) : <p>Confirm exclusions during your enquiry.</p>}
        </section>
      </div>
    </div>
  );
}
