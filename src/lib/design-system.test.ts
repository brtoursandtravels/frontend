import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

function filesBelow(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(candidate) : [candidate];
  });
}

describe("public design system", () => {
  it("keeps branded colors in globals.css instead of component source", () => {
    const globals = readFileSync(
      path.join(projectRoot, "src/app/globals.css"),
      "utf8",
    );
    for (const token of [
      "--color-primary:",
      "--color-secondary:",
      "--color-accent:",
      "--color-bg-base:",
      "--color-text-heading:",
      "--shadow-card:",
      "--animate-shimmer:",
    ]) {
      expect(globals).toContain(token);
    }
    expect(globals).toMatch(
      /--color-primary-hover:\s*color-mix\([^;]+var\(--color-primary\)/,
    );

    const componentFiles = filesBelow(path.join(projectRoot, "src")).filter(
      (file) => file.endsWith(".tsx"),
    );
    for (const file of componentFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/#[\da-f]{3,8}(?![\da-z_-])/i);
      expect(source, file).not.toMatch(/\brgb\(/i);
    }
  });

  it("uses the planned PascalCase component locations without root bridges", () => {
    const required = [
      "src/components/common/EnquiryModal.tsx",
      "src/components/common/ImageLightbox.tsx",
      "src/components/common/PaginationControls.tsx",
      "src/components/forms/EnquiryForm.tsx",
      "src/components/forms/QuickSearchForm.tsx",
      "src/components/home/AnimatedCanvasHero.tsx",
      "src/components/home/FlagshipToursShowcase.tsx",
      "src/components/packages/PackageCard.tsx",
      "src/components/packages/ItineraryTimeline.tsx",
      "src/lib/animations.ts",
    ];
    for (const file of required) {
      expect(existsSync(path.join(projectRoot, file)), file).toBe(true);
    }
    const rootComponentFiles = readdirSync(
      path.join(projectRoot, "src/components"),
      { withFileTypes: true },
    ).filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"));
    expect(rootComponentFiles).toHaveLength(0);
  });
});
