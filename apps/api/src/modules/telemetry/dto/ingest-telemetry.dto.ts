import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsNumber, IsString, Max, Min } from "class-validator";

export class IngestTelemetryDto {
  @ApiProperty({ example: "asset-coldstore-01" })
  @IsString()
  assetId!: string;

  @ApiProperty({ example: "2026-05-11T10:00:00.000Z" })
  @IsISO8601()
  timestamp!: string;

  @ApiProperty({ example: 49.98 })
  @IsNumber()
  @Min(45)
  @Max(55)
  frequencyHz!: number;

  @ApiProperty({ example: 229.4 })
  @IsNumber()
  @Min(0)
  voltage!: number;

  @ApiProperty({ example: 840 })
  @IsNumber()
  powerKw!: number;

  @ApiProperty({ example: 31.6 })
  @IsNumber()
  temperatureC!: number;
}

