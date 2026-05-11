import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { trace } from "@opentelemetry/api";
import type { DispatchEvent, GridAsset } from "@grid-ops/shared";
import { AssetsService } from "../assets/assets.service.js";
import type { CreateDispatchDto } from "./dto/create-dispatch.dto.js";

@Injectable()
export class DispatchService {
  private readonly tracer = trace.getTracer("grid-ops-api");
  private readonly events: DispatchEvent[] = [];

  constructor(private readonly assetsService: AssetsService) {}

  list() {
    return this.events;
  }

  getById(id: string) {
    const event = this.events.find((item) => item.id === id);

    if (!event) {
      throw new NotFoundException(`Dispatch event ${id} was not found`);
    }

    return event;
  }

  create(dto: CreateDispatchDto) {
    return this.tracer.startActiveSpan("dispatch.create", (span) => {
      try {
        const selectedAssetIds = this.selectAssets(
          this.assetsService.list(),
          dto.targetKw,
        ).map((asset) => asset.id);

        const event: DispatchEvent = {
          id: randomUUID(),
          createdAt: new Date().toISOString(),
          targetKw: dto.targetKw,
          durationSeconds: dto.durationSeconds,
          status: selectedAssetIds.length > 0 ? "active" : "queued",
          selectedAssetIds,
        };

        this.events.unshift(event);
        this.assetsService.markResponding(selectedAssetIds);
        span.setAttribute("dispatch.target_kw", dto.targetKw);
        span.setAttribute("dispatch.selected_assets", selectedAssetIds.length);

        return event;
      } finally {
        span.end();
      }
    });
  }

  selectAssets(assets: GridAsset[], targetKw: number) {
    const selected: GridAsset[] = [];
    let remainingKw = targetKw;

    const candidates = assets
      .filter((asset) => asset.status !== "offline" && asset.availableKw > 0)
      .sort((left, right) => this.scoreAsset(right) - this.scoreAsset(left));

    for (const asset of candidates) {
      selected.push(asset);
      remainingKw -= asset.availableKw;

      if (remainingKw <= 0) {
        break;
      }
    }

    return selected;
  }

  private scoreAsset(asset: GridAsset) {
    const capacityScore = asset.availableKw / Math.max(asset.capacityKw, 1);
    const speedScore = 1 / Math.max(asset.responseTimeMs, 1);
    const statusBonus = asset.status === "online" ? 0.15 : 0;

    return capacityScore + speedScore * 40 + statusBonus;
  }
}
