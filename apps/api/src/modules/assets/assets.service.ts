import { Injectable, NotFoundException } from "@nestjs/common";
import {
  calculateFleetSummary,
  type GridAsset,
} from "@grid-ops/shared";

const now = () => new Date().toISOString();

const seedAssets = (): GridAsset[] => [
  {
    id: "asset-coldstore-01",
    name: "Cold Store Compressor Bank",
    site: "Harbour Logistics",
    region: "Munster",
    status: "online",
    capacityKw: 1800,
    availableKw: 1240,
    responseTimeMs: 78,
    lastSeen: now(),
  },
  {
    id: "asset-foundry-02",
    name: "Induction Furnace Load",
    site: "Riverside Foundry",
    region: "Leinster",
    status: "standby",
    capacityKw: 2400,
    availableKw: 1625,
    responseTimeMs: 112,
    lastSeen: now(),
  },
  {
    id: "asset-campus-03",
    name: "Campus HVAC Aggregator",
    site: "North Campus",
    region: "Connacht",
    status: "responding",
    capacityKw: 950,
    availableKw: 380,
    responseTimeMs: 64,
    lastSeen: now(),
  },
  {
    id: "asset-battery-04",
    name: "Distribution Battery Rack",
    site: "Midlands Storage",
    region: "Leinster",
    status: "online",
    capacityKw: 3200,
    availableKw: 2800,
    responseTimeMs: 41,
    lastSeen: now(),
  },
];

@Injectable()
export class AssetsService {
  private readonly assets = new Map<string, GridAsset>(
    seedAssets().map((asset) => [asset.id, asset]),
  );

  list() {
    return [...this.assets.values()];
  }

  getSummary() {
    return calculateFleetSummary(this.list());
  }

  getById(id: string) {
    const asset = this.assets.get(id);

    if (!asset) {
      throw new NotFoundException(`Asset ${id} was not found`);
    }

    return asset;
  }

  markResponding(assetIds: string[]) {
    for (const assetId of assetIds) {
      const asset = this.getById(assetId);
      this.assets.set(assetId, {
        ...asset,
        status: "responding",
        availableKw: Math.max(0, Math.round(asset.availableKw * 0.35)),
        lastSeen: now(),
      });
    }
  }
}
