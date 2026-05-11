import type {
  DispatchEvent,
  FleetSummary,
  GridAsset,
  TelemetryReading,
} from "@grid-ops/shared";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBase}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const api = {
  assets: () => request<GridAsset[]>("/assets"),
  summary: () => request<FleetSummary>("/assets/summary"),
  telemetry: (assetId: string) =>
    request<TelemetryReading[]>(`/telemetry/${assetId}`),
  dispatchEvents: () => request<DispatchEvent[]>("/dispatch-events"),
  createDispatch: (targetKw: number, durationSeconds: number) =>
    request<DispatchEvent>("/dispatch-events", {
      method: "POST",
      body: JSON.stringify({ targetKw, durationSeconds }),
    }),
};

const now = new Date().toISOString();

export const demoAssets: GridAsset[] = [
  {
    id: "asset-coldstore-01",
    name: "Cold Store Compressor Bank",
    site: "Harbour Logistics",
    region: "Munster",
    status: "online",
    capacityKw: 1800,
    availableKw: 1240,
    responseTimeMs: 78,
    lastSeen: now,
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
    lastSeen: now,
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
    lastSeen: now,
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
    lastSeen: now,
  },
];

export const demoTelemetry = (assetId: string): TelemetryReading[] =>
  Array.from({ length: 12 }, (_, index) => ({
    assetId,
    timestamp: new Date(Date.now() - index * 60_000).toISOString(),
    frequencyHz: Number((49.9 + Math.sin(index / 2) * 0.06).toFixed(3)),
    voltage: Number((229 + Math.cos(index / 3) * 2.1).toFixed(1)),
    powerKw: Math.round(680 + Math.sin(index / 1.5) * 120),
    temperatureC: Number((30 + Math.cos(index / 4) * 3).toFixed(1)),
  }));

