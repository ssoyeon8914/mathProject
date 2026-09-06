import { describe, expect, it } from "vitest";
import {
  createLocalToken,
  createUserId,
  validateDisplayName,
  shortUserId,
} from "@/lib/auth";

describe("auth helpers", () => {
  it("creates local tokens of requested length", () => {
    expect(createLocalToken(8)).toHaveLength(8);
    expect(createLocalToken(6)).toMatch(/^[a-z0-9]+$/);
  });

  it("builds mode-prefixed user ids", () => {
    expect(createUserId("guest")).toMatch(/^guest-[a-z0-9]{8}$/);
    expect(createUserId("named")).toMatch(/^named-[a-z0-9]{8}$/);
  });

  it("validates display names", () => {
    expect(validateDisplayName("  ").ok).toBe(false);
    expect(validateDisplayName("민수").ok).toBe(true);
    expect(validateDisplayName("민수").value).toBe("민수");
    expect(validateDisplayName("아주아주아주아주긴이름이에요").ok).toBe(false);
  });

  it("shortens user ids for display", () => {
    expect(shortUserId("guest-abcdef12")).toBe("abcdef");
  });
});
