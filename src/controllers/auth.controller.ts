import { Body, Controller, Inject, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDTO } from "src/dtos/auth.dto";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { LoginResponse } from "src/example-responses/auth.response";

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) { }

  @Post('login')
  @ApiOperation({
    summary: 'Login User',
    description: 'Login User',
    tags: ['Auth']
  })
  @ApiOkResponse({
    description: 'Success Login',
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
    description: 'User not found',
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
    description: 'Password is incorrect',
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
    description: 'Internal Server Error',
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