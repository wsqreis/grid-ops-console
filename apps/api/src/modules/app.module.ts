import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AssetsModule } from "./assets/assets.module.js";
import { DispatchModule } from "./dispatch/dispatch.module.js";
import { HealthModule } from "./health/health.module.js";
import { TelemetryModule } from "./telemetry/telemetry.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AssetsModule,
    DispatchModule,
    HealthModule,
    TelemetryModule,
  ],
})
export class AppModule {}

