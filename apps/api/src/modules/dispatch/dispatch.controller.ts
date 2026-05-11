import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateDispatchDto } from "./dto/create-dispatch.dto.js";
import { DispatchService } from "./dispatch.service.js";

@ApiTags("dispatch")
@Controller("dispatch-events")
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get()
  listEvents() {
    return this.dispatchService.list();
  }

  @Get(":id")
  getEvent(@Param("id") id: string) {
    return this.dispatchService.getById(id);
  }

  @Post()
  createEvent(@Body() dto: CreateDispatchDto) {
    return this.dispatchService.create(dto);
  }
}

