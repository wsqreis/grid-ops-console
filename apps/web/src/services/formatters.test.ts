import assert from "node:assert/strict";
import test from "node:test";
import { formatKw, formatTimeAgo } from "./formatters";

test("formatKw formats capacity using Irish numeric separators", () => {
  assert.equal(formatKw(12500), "12,500");
});

test("formatTimeAgo formats recent telemetry timestamps", () => {
  const now = new Date("2026-05-11T12:00:00.000Z");
  assert.equal(formatTimeAgo("2026-05-11T11:58:00.000Z", now), "2m ago");
});

