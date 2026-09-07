export function BadgePill({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "gold" | "coral" | "light";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    gold: "bg-accent-soft text-secondary-hover",
    coral: "bg-accent-soft text-secondary-hover",
    light: "bg-white/15 text-white",
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold ${tones[tone]}`}>
      {children}
    </span>
  );
}
