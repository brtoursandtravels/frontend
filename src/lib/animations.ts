export const animationClasses = {
  cardLift:
    "transition duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transform-none motion-reduce:transition-none",
  imageZoom:
    "transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none",
  revealUp: "motion-safe:animate-reveal-up motion-reduce:animate-none",
} as const;
