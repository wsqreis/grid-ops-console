import { Module } from "@nestjs/common";
import { AssetsModule } from "../assets/assets.module.js";
import { DispatchController } from "./dispatch.controller.js";
import { DispatchService } from "./dispatch.service.js";

@Module({
  imports: [AssetsModule],
  controllers: [DispatchController],
  providers: [DispatchService],
})
export class DispatchModule {}

