import { describe, expect, it } from "vitest";
import { subtractDates } from "./helpers";

describe("booking nights", () => {
  it("counts the night across the Cairo daylight-saving change", () => {
    expect(subtractDates("2026-10-30T00:00:00.000Z", "2026-10-29T00:00:00.000Z")).toBe(1);
  });

  it("accepts Date objects as well as ISO strings", () => {
    expect(subtractDates(new Date("2026-10-30T00:00:00.000Z"), new Date("2026-10-23T00:00:00.000Z"))).toBe(7);
  });
});
