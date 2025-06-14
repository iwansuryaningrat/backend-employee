import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/common/database/prisma.service";
import { IUserData } from "@app/common/interfaces/user.interface";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EmployeeService } from "./employee.service";
import { getRangeMonth } from "@app/common/helpers";
import { Cache } from 'cache-manager';
import { PayslipDTO } from "../dtos";

@Injectable()
export class AdminService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(EmployeeService) private readonly employeeService: EmployeeService,
  ) { }

  private readonly logger = new Logger(AdminService.name);

  async runPayroll(data: PayslipDTO) {
    try {
      const month = data.month;
      const year = Number(data.year);

      const isRunned = await this.isRunnedPayroll(month, year);
      if (isRunned) throw new BadRequestException('Payroll already runned');

      const employees = await this.prisma.employees.findMany({
        include: {
          user: true
        }
      });

      await Promise.all(employees.map(async (employee) => {
        const user: IUserData = employee.user;
        const employeePayslip = (await this.employeeService.employeePayslip(user)).data;
        await this.prisma.payslips.create({
          data: {
            userId: user.id,
            month,
            year,
            takeHomePay: employeePayslip.takeHomePay
          }
        })
      }))

      await this.updatePayrollStatuses(getRangeMonth(new Date(`${year}-${month}-01`).getMonth(), year));

      return {
        message: `Payroll for ${month} ${year} has been runned!`,
      }
    } catch (error) {
      this.logger.error(this.runPayroll.name, error?.message);
      throw new HttpException(error.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async isRunnedPayroll(month: string, year: number): Promise<boolean> {
    try {
      const payslip = await this.prisma.payslips.findFirst({
        where: {
          month,
          year
        }
      });

      return !!payslip;
    } catch (error) {
      this.logger.error(this.isRunnedPayroll.name, error?.message);
      throw new HttpException(error.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async updatePayrollStatuses({ startDay, endDay }) {
    try {
      await this.prisma.attendances.updateMany({
        where: {
          created_at: {
            gte: new Date(startDay),
            lte: new Date(endDay)
          }
        },
        data: {
          is_run_payroll: true
        }
      });

      await this.prisma.overtimes.updateMany({
        where: {
          created_at: {
            gte: new Date(startDay),
            lte: new Date(endDay)
          }
        },
        data: {
          is_run_payroll: true
        }
      });

      await this.prisma.reimbursements.updateMany({
        where: {
          created_at: {
            gte: new Date(startDay),
            lte: new Date(endDay)
          }
        },
        data: {
          is_run_payroll: true
        }
      });
    } catch (error) {
      this.logger.error(this.updatePayrollStatuses.name, error?.message);
      throw new HttpException(error.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPayslipSummary(data: PayslipDTO) {
    try {
      const month = data.month;
      const year = Number(data.year);

      const KEY_CACHE = `getPayslipSummary:${year}-${month}`;
      const cacheData = await this.cacheManager.get<Awaited<ReturnType<AdminService['getPayslipSummary']>>>(KEY_CACHE);
      if (cacheData) return cacheData;

      const payslips = await this.prisma.payslips.findMany({
        where: {
          month,
          year
        },
        include: {
          user: true
        }
      });

      let totalEmployeesTakeHomePay = 0;

      const employeesSummary = payslips.map((payslip) => {
        totalEmployeesTakeHomePay += payslip.takeHomePay;
        return {
          name: payslip.user.name,
          takeHomePay: payslip.takeHomePay
        }
      })

      const result = {
        message: `Payslip summary for ${month} ${year}`,
        totalEmployeesTakeHomePay,
        employeesSummary,
      }

      await this.cacheManager.set(KEY_CACHE, result,);

      return result
    } catch (error) {
      this.logger.error(this.getPayslipSummary.name, error?.message);
      throw new HttpException(error.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}