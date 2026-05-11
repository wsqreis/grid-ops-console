export type AssetStatus = "online" | "standby" | "responding" | "offline";

export interface GridAsset {
  id: string;
  name: string;
  site: string;
  region: string;
  status: AssetStatus;
  capacityKw: number;
  availableKw: number;
  responseTimeMs: number;
  lastSeen: string;
}

export interface TelemetryReading {
  assetId: string;
  timestamp: string;
  frequencyHz: number;
  voltage: number;
  powerKw: number;
  temperatureC: number;
}

export interface DispatchEvent {
  id: string;
  createdAt: string;
  targetKw: number;
  durationSeconds: number;
  status: "queued" | "active" | "completed" | "cancelled";
  selectedAssetIds: string[];
}

export interface FleetSummary {
  totalCapacityKw: number;
  availableKw: number;
  onlineAssets: number;
  respondingAssets: number;
  averageResponseTimeMs: number;
}

export const calculateFleetSummary = (assets: GridAsset[]): FleetSummary => {
  const responsiveAssets = assets.filter((asset) => asset.status !== "offline");
  const totalResponseTime = responsiveAssets.reduce(
    (sum, asset) => sum + asset.responseTimeMs,
    0,
  );

  return {
    totalCapacityKw: assets.reduce((sum, asset) => sum + asset.capacityKw, 0),
    availableKw: assets.reduce((sum, asset) => sum + asset.availableKw, 0),
    onlineAssets: assets.filter((asset) => asset.status === "online").length,
    respondingAssets: assets.filter((asset) => asset.status === "responding")
      .length,
    averageResponseTimeMs:
      responsiveAssets.length === 0
        ? 0
        : Math.round(totalResponseTime / responsiveAssets.length),
  };
};

