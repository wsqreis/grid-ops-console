import { Module } from "@nestjs/common";
import { AssetsModule } from "../assets/assets.module.js";
import { TelemetryController } from "./telemetry.controller.js";
import { TelemetryService } from "./telemetry.service.js";

@Module({
  imports: [AssetsModule],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}

