import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class SubmitOvertimeDTO {
  @ApiProperty({ type: Number, required: true, example: 3 })
  @IsNotEmpty()
  @IsNumber()
  @Max(3, {
    message: "Hours must be less than or equal to 3"
  })
  @Min(1)
  hours: number

  @ApiProperty({ type: String, required: false, example: "No reason" })
  @IsOptional()
  @IsString()
  reason?: string
}