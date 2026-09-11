import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  compact = false,
  inverse = false,
  onNavigate,
}: {
  compact?: boolean;
  inverse?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      className="inline-flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.025]"
      href="/"
      aria-label="BR Tours and Travels home"
      onClick={onNavigate}
    >
      <Image
        className={`w-auto shrink-0 object-contain ${compact ? "h-10 sm:h-[2.75rem]" : "h-[2.75rem] sm:h-[3.45rem]"}`}
        src="/br-mark.png"
        alt=""
        width={555}
        height={502}
      />
      <span
        className={`ml-2 whitespace-nowrap font-heading text-[0.72rem] font-black uppercase leading-none tracking-[0.035em] sm:text-[0.82rem] ${inverse ? "text-white" : "text-primary"}`}
      >
        Tours and Travels
      </span>
    </Link>
  );
}
