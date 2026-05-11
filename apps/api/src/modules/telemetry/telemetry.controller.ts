import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IngestTelemetryDto } from "./dto/ingest-telemetry.dto.js";
import { TelemetryService } from "./telemetry.service.js";

@ApiTags("telemetry")
@Controller("telemetry")
export class TelemetryController {
  constructor(@Inject(TelemetryService) private readonly telemetryService: TelemetryService) {}

  @Get(":assetId")
  getReadings(@Param("assetId") assetId: string) {
    return this.telemetryService.getForAsset(assetId);
  }

  @Post()
  ingest(@Body() dto: IngestTelemetryDto) {
    return this.telemetryService.ingest(dto);
  }
}
