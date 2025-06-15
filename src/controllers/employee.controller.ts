import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetPayslipResponse, SubmitAttendanceResponse, SubmitOvertimeResponse, SubmitReimburseResponse } from "../example-responses";
import { Body, Controller, Get, Inject, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { imageFilter, limitImageUpload, storageSetting } from "../helpers/validators/file.validator";
import { AuthenticationGuard } from "../auth/authentication.guard";
import { AuthorizationGuard } from "../auth/authorization.guard";
import { SubmitOvertimeDTO, SubmitReimburseDTO } from "../dtos";
import { EmployeeService } from "../services/employee.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "@prisma/client";
import { diskStorage } from 'multer';

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

  @Post('submit-overtime')
  @ApiOperation({
    summary: 'Submit Overtime',
    description: 'Submit Overtime for employees'
  })
  @ApiOkResponse({
    description: 'Success Response',
    example: SubmitOvertimeResponse,
    schema: {
      properties: {
        message: { type: 'string' },
        overtime: {
          properties: {
            id: { type: 'number' },
            userId: { type: 'number' },
            date: { type: 'string' },
            hours: { type: 'number' },
            amount: { type: 'number' },
            reason: { type: 'string' },
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
      "message": "It's too early to submit your overtime!"
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
  async submitOvertime(@Request() req: any, @Body() data: SubmitOvertimeDTO) {
    return await this.employeeService.submitOvertime(req.user, data);
  }

  @Post('submit-reimburse')
  @ApiOperation({
    summary: 'Submit Reimburse',
    description: 'Submit Reimburse for employees'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    schema: {
      type: 'multipart/form-data',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        },
        description: {
          type: 'string',
        },
        amount: {
          type: 'number',
        },
      },
      required: ['file', 'description', 'amount'],
    },
  })
  @ApiOkResponse({
    description: 'Success Response',
    example: SubmitReimburseResponse,
    schema: {
      properties: {
        message: { type: 'string' },
        reimburse: {
          properties: {
            id: { type: 'number' },
            userId: { type: 'number' },
            description: { type: 'string' },
            amount: { type: 'number' },
            link: { type: 'string' },
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
      "message": "You cannot submit reimbursement on weekends!"
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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage(storageSetting),
    fileFilter: imageFilter,
    limits: limitImageUpload(),
  }))
  async submitReimburse(@Request() req: any, @UploadedFile() file: Express.Multer.File, @Body() data: SubmitReimburseDTO) {
    return await this.employeeService.submitReimburse(req.user, data, file);
  }

  @Get('payslip')
  @ApiOperation({
    summary: 'Get Payslip',
    description: 'Get Current Payslip for employees'
  })
  @ApiOkResponse({
    description: 'Success Response',
    example: GetPayslipResponse,
    schema: {
      properties: {
        message: { type: 'string' },
        data: {
          properties: {
            attendances: {
              properties: {
                totalWorkingDays: { type: 'number' },
                totalPresentDays: { type: 'number' },
                totalLateDays: { type: 'number' },
                totalAbsentDays: { type: 'number' },
              }
            },
            overtimes: {
              properties: {
                totalHours: { type: 'number' },
                totalPay: { type: 'number' },
                overtimes: {
                  type: 'array',
                  items: {
                    properties: {
                      date: { type: 'string' },
                      hours: { type: 'number' },
                      totalPay: { type: 'number' },
                    }
                  }
                }
              }
            },
            reimbursements: {
              properties: {
                totalAmount: { type: 'number' },
                reimbursements: {
                  type: 'array',
                  items: {
                    properties: {
                      description: { type: 'string' },
                      amount: { type: 'number' },
                      link: { type: 'string' },
                      created_at: { type: 'string' },
                    }
                  }
                }
              }
            },
            baseSalary: { type: 'number' },
            takeHomePay: { type: 'number' },
            month: { type: 'string' },
            year: { type: 'number' },
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Error Response',
    example: {
      "statusCode": 400,
      "message": "You cannot get payslip!"
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
  async payslip(@Request() req: any) {
    return await this.employeeService.employeePayslip(req.user);
  }
}