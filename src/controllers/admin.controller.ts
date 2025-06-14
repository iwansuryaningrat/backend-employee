import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Inject, Post, Query, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { PayslipSummaryResponse } from "src/example-responses";
import { AdminService } from "src/services/admin.service";
import { Role } from "@prisma/client";
import { PayslipDTO } from "src/dtos";


@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles([Role.admin])
@ApiTags('Admin')
@ApiBearerAuth('Authorization')
@Controller('admin')
export class AdminController {
  constructor(
    @Inject(AdminService) private readonly adminService: AdminService,
  ) { }

  @Post('run-payroll')
  @ApiOperation({
    summary: 'Run Payroll',
    description: 'Run Payroll for all employees in a month'
  })
  @ApiOkResponse({
    description: 'Payroll runned successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Payroll for January 2024 has been runned!'
        }
      }
    },
    example: {
      message: 'Payroll for January 2024 has been runned!'
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Error Response',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Payroll already runned'
        }
      }
    },
    example: {
      message: 'Payroll already runned'
    }
  })
  @ApiForbiddenResponse({
    description: 'Forbidden Error Response',
    example: {
      "statusCode": 403,
      "message": "You are not an admin!"
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
  async runPayroll(@Body() data: PayslipDTO) {
    return await this.adminService.runPayroll(data);
  }

  @Get('payslip-summary')
  @ApiOperation({
    summary: 'Get Payslip Summary',
    description: 'Get Payslip Summary for all employees in a month'
  })
  @ApiOkResponse({
    description: 'Payslip Summary fetched successfully',
    schema: {
      type: 'object',
      properties: {
        totalEmployeesTakeHomePay: {
          type: 'number',
          example: 10000
        },
        employeesSummary: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'John Doe'
              },
              takeHomePay: {
                type: 'number',
                example: 10000
              }
            }
          }
        }
      }
    },
    example: PayslipSummaryResponse
  })
  @ApiForbiddenResponse({
    description: 'Forbidden Error Response',
    example: {
      "statusCode": 403,
      "message": "You are not an admin!"
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
  async getPayslipSummary(@Query() data: PayslipDTO) {
    return await this.adminService.getPayslipSummary(data);
  }
}