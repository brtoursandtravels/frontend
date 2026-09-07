import { describe, expect, it } from "vitest";
import { packageCardSchema } from "./contracts";

describe("packageCardSchema", () => {
  it("rejects an unlabelled malformed package payload", () => {
    expect(
      packageCardSchema.safeParse({
        id: "one",
        slug: "demo",
        title: "Demo",
        summary: "Test",
      }).success,
    ).toBe(false);
  });
});
