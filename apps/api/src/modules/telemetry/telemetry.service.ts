import { Injectable } from "@nestjs/common";
import type { TelemetryReading } from "@grid-ops/shared";
import { AssetsService } from "../assets/assets.service.js";
import type { IngestTelemetryDto } from "./dto/ingest-telemetry.dto.js";

@Injectable()
export class TelemetryService {
  private readonly readings = new Map<string, TelemetryReading[]>();

  constructor(private readonly assetsService: AssetsService) {}

  getForAsset(assetId: string) {
    this.assetsService.getById(assetId);
    return this.readings.get(assetId) ?? this.seedReadings(assetId);
  }

  ingest(dto: IngestTelemetryDto) {
    this.assetsService.getById(dto.assetId);
    const reading: TelemetryReading = { ...dto };
    const existing = this.readings.get(dto.assetId) ?? [];
    const nextReadings = [reading, ...existing].slice(0, 50);
    this.readings.set(dto.assetId, nextReadings);

    return reading;
  }

  private seedReadings(assetId: string) {
    const readings = Array.from({ length: 12 }, (_, index) => ({
      assetId,
      timestamp: new Date(Date.now() - index * 60_000).toISOString(),
      frequencyHz: Number((49.9 + Math.sin(index / 2) * 0.06).toFixed(3)),
      voltage: Number((229 + Math.cos(index / 3) * 2.1).toFixed(1)),
      powerKw: Math.round(680 + Math.sin(index / 1.5) * 120),
      temperatureC: Number((30 + Math.cos(index / 4) * 3).toFixed(1)),
    }));

    this.readings.set(assetId, readings);
    return readings;
  }
}

