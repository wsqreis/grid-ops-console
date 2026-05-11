import { describe, expect, it } from "vitest";
import { calculateFleetSummary, type GridAsset } from "./index";

const asset = (overrides: Partial<GridAsset>): GridAsset => ({
  id: "asset-1",
  name: "Main Incomer",
  site: "Foundry A",
  region: "Munster",
  status: "online",
  capacityKw: 1000,
  availableKw: 700,
  responseTimeMs: 90,
  lastSeen: "2026-05-11T10:00:00.000Z",
  ...overrides,
});

describe("calculateFleetSummary", () => {
  it("summarises capacity, availability, and response posture", () => {
    const summary = calculateFleetSummary([
      asset({ id: "asset-1" }),
      asset({
        id: "asset-2",
        status: "responding",
        capacityKw: 500,
        availableKw: 125,
        responseTimeMs: 70,
      }),
      asset({
        id: "asset-3",
        status: "offline",
        capacityKw: 250,
        availableKw: 0,
        responseTimeMs: 200,
      }),
    ]);

    expect(summary).toEqual({
      totalCapacityKw: 1750,
      availableKw: 825,
      onlineAssets: 1,
      respondingAssets: 1,
      averageResponseTimeMs: 80,
    });
  });
});

