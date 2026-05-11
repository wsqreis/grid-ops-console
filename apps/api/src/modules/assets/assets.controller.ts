import { Controller, Get, Inject, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AssetsService } from "./assets.service.js";

@ApiTags("assets")
@Controller("assets")
export class AssetsController {
  constructor(
    @Inject(AssetsService) private readonly assetsService: AssetsService,
  ) {}

  @Get()
  listAssets() {
    return this.assetsService.list();
  }

  @Get("summary")
  getSummary() {
    return this.assetsService.getSummary();
  }

  @Get(":id")
  getAsset(@Param("id") id: string) {
    return this.assetsService.getById(id);
  }
}
