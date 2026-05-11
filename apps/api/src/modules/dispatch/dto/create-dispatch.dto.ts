import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";

export class CreateDispatchDto {
  @ApiProperty({ example: 2000, minimum: 1, maximum: 10000 })
  @IsInt()
  @Min(1)
  @Max(10000)
  targetKw!: number;

  @ApiProperty({ example: 300, minimum: 30, maximum: 3600 })
  @IsInt()
  @Min(30)
  @Max(3600)
  durationSeconds!: number;
}

