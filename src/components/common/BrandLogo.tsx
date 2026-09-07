import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      className="inline-flex shrink-0 transition-transform duration-200 hover:scale-[1.025]"
      href="/"
      aria-label="BR Tours and Travels home"
      onClick={onNavigate}
    >
      <Image
        className={`w-auto object-contain ${compact ? "h-10 sm:h-[2.9rem]" : "h-[2.7rem] sm:h-[3.45rem]"}`}
        src="/br-logo-transparent.png"
        alt=""
        width={270}
        height={90}
        priority={!compact}
      />
    </Link>
  );
}
