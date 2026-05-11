import { describe, expect, it } from "vitest";
import type { GridAsset } from "@grid-ops/shared";
import { AssetsService } from "../assets/assets.service.js";
import { DispatchService } from "./dispatch.service.js";

const asset = (overrides: Partial<GridAsset>): GridAsset => ({
  id: "asset",
  name: "Load",
  site: "Site",
  region: "Region",
  status: "online",
  capacityKw: 1000,
  availableKw: 500,
  responseTimeMs: 100,
  lastSeen: new Date().toISOString(),
  ...overrides,
});

describe("DispatchService", () => {
  it("selects responsive assets until the requested capacity is covered", () => {
    const service = new DispatchService(new AssetsService());
    const selected = service.selectAssets(
      [
        asset({ id: "slow", availableKw: 900, responseTimeMs: 450 }),
        asset({ id: "fast", availableKw: 450, responseTimeMs: 40 }),
        asset({
          id: "offline",
          status: "offline",
          availableKw: 2000,
          responseTimeMs: 10,
        }),
      ],
      1200,
    );

    expect(selected.map((item) => item.id)).toEqual(["fast", "slow"]);
  });

  it("creates an active dispatch event and updates selected assets", () => {
    const assets = new AssetsService();
    const service = new DispatchService(assets);
    const event = service.create({ targetKw: 1500, durationSeconds: 300 });

    expect(event.status).toBe("active");
    expect(event.selectedAssetIds.length).toBeGreaterThan(0);
    expect(
      event.selectedAssetIds.every(
        (assetId) => assets.getById(assetId).status === "responding",
      ),
    ).toBe(true);
  });
});

