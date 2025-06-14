import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PayslipDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: "January" })
  month: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 2023 })
  year: string
}