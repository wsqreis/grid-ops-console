import { describe, expect, it } from "vitest";
import { formatKw, formatTimeAgo } from "./formatters";

describe("formatters", () => {
  it("formats capacity using Irish numeric separators", () => {
    expect(formatKw(12500)).toBe("12,500");
  });

  it("formats recent telemetry timestamps", () => {
    const now = new Date("2026-05-11T12:00:00.000Z");
    expect(formatTimeAgo("2026-05-11T11:58:00.000Z", now)).toBe("2m ago");
  });
});

