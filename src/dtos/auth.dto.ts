import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class LoginDTO {
  @ValidateIf((e) => !!e)
  @ApiProperty({ type: String, required: true, example: "admin@example.com" })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ type: String, required: true, example: "password" })
  @IsNotEmpty()
  @IsString()
  password: string;
}