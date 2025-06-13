import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { EmployeeService } from "src/services/employee.service";
import { Controller, Inject, Post, Request, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { SubmitAttendanceResponse } from "src/example-responses";
import { date } from "joi";

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles([Role.employee])
@ApiTags('Employees')
@ApiBearerAuth('Authorization')
@Controller('employee')
export class EmployeeController {
  constructor(
    @Inject(EmployeeService) private readonly employeeService: EmployeeService,
  ) { }

  @Post('submit-attendance')
  @ApiOperation({
    summary: 'Submit Attendance',
    description: 'Submit Attendance for employees (check-in and check-out)'
  })
  @ApiOkResponse({
    description: 'Success Response',
    example: SubmitAttendanceResponse,
    schema: {
      properties: {
        message: { type: 'string' },
        attendance: {
          properties: {
            id: { type: 'number' },
            userId: { type: 'number' },
            date: { type: 'string' },
            status: { type: 'string' },
            checkIn: { type: 'string' },
            checkOut: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Error Response',
    example: {
      "statusCode": 400,
      "message": "You cannot submit attendance on weekends!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  @ApiForbiddenResponse({
    description: 'Forbidden Error Response',
    example: {
      "statusCode": 403,
      "message": "You are not an employee!"
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
  async submitAttendance(@Request() req: any) {
    return await this.employeeService.submitAttendance(req.user);
  }
}