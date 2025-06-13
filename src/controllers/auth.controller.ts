import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginResponse } from "src/example-responses/auth.response";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDTO } from "src/dtos/auth.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) { }

  @Post('login')
  @ApiOperation({
    summary: 'Login User',
    description: 'Login User',
  })
  @ApiOkResponse({
    description: 'Success Response',
    example: LoginResponse,
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            name: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Not Found Error Response',
    example: {
      "statusCode": 404,
      "message": "User not found!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Error Response',
    example: {
      "statusCode": 400,
      "message": "Password is incorrect!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error Response',
    example: {
      "statusCode": 500,
      "message": "Internal Server Error!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  async login(@Body() data: LoginDTO) {
    return await this.authService.login(data);
  }
}