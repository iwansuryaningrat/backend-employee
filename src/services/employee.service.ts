import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { endWorkingTime, startWorkingTime, workingHours } from "@app/common/constants";
import { countWeekdaysInMonth, getDates } from "@app/common/helpers";
import { PrismaService } from "@app/common/database/prisma.service";
import { IUserData } from "@app/common/interfaces/user.interface";
import { SubmitOvertimeDTO, SubmitReimburseDTO } from "../dtos/employee.dto";
import { AttendanceStatus, Role } from "@prisma/client";
import * as moment from "moment-timezone";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) { }

  private readonly logger = new Logger(EmployeeService.name);

  private filePath = this.configService.get<string>('ASSETS_HOST');

  async submitAttendance(user: IUserData) {
    try {
      const { date, today, dayOfWeek } = getDates();
      if (dayOfWeek === 0 || dayOfWeek === 6) throw new BadRequestException("You cannot submit attendance on weekends!");

      const message = `You have submitted your attendance for ${today}, ${user.name}!`;
      let attendance = await this.prisma.attendances.findFirst({
        where: {
          userId: user.id,
          date: today
        }
      });

      if (!attendance) {
        const checkinStatus = (moment(date, "DD-MM-YYYY HH:mm:ss").isBefore(moment(today + ' ' + startWorkingTime, "DD-MM-YYYY HH:mm:ss"))) ? AttendanceStatus.present : AttendanceStatus.late;

        attendance = await this.prisma.attendances.create({
          data: {
            userId: user.id,
            date: today,
            status: checkinStatus,
            checkIn: date.toDate(),
          }
        });

        return { message, attendance }
      }

      if (attendance?.checkOut) throw new BadRequestException("You have already submitted your attendance for today!");

      if (moment(date, "DD-MM-YYYY HH:mm:ss").isBefore(moment(today + ' ' + endWorkingTime, "DD-MM-YYYY HH:mm:ss"))) throw new BadRequestException("It's too early to submit your check out attendance!");

      // Auto submit overtime when check out is 1 hour after end working time
      const isOverEndWorkingTime: boolean = moment(date, "DD-MM-YYYY HH:mm:ss").isAfter(moment(today + ' ' + endWorkingTime, "DD-MM-YYYY HH:mm:ss").add(1, 'hours'));
      if (isOverEndWorkingTime) {
        const hoursOver = moment(date, "DD-MM-YYYY HH:mm:ss").diff(moment(today + ' ' + endWorkingTime, "DD-MM-YYYY HH:mm:ss"), 'hours');
        await this.submitOvertime(user, { hours: hoursOver });
      }

      attendance = await this.prisma.attendances.update({
        where: {
          id: attendance.id
        },
        data: {
          checkOut: new Date(),
        }
      });

      return { message, attendance }
    } catch (error) {
      this.logger.error(this.submitAttendance.name, error?.message);
      throw new HttpException(error.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async submitOvertime(user: IUserData, data: SubmitOvertimeDTO) {
    try {
      const { date, today, dayOfWeek } = getDates();
      const isWeekend: boolean = dayOfWeek === 0 || dayOfWeek === 6;
      const isBeforeEndWorkingTime: boolean = moment(date, "DD-MM-YYYY HH:mm:ss").isBefore(moment(today + ' ' + endWorkingTime, "DD-MM-YYYY HH:mm:ss"));

      if (!isWeekend && isBeforeEndWorkingTime) throw new BadRequestException("It's too early to submit your overtime!");

      const employee = await this.prisma.employees.findUnique({
        where: {
          userId: user.id
        }
      });
      if (!employee) throw new NotFoundException("Employee not found!");

      const overtimePay = this.calculateOvertimePay(employee.salary, data.hours);

      const todayOvertime = await this.prisma.overtimes.findFirst({
        where: {
          userId: user.id,
          date: today
        }
      });

      if (todayOvertime) {
        let overtime = await this.prisma.overtimes.update({
          where: {
            id: todayOvertime.id
          },
          data: {
            hours: data.hours,
            amount: overtimePay,
            reason: data?.reason ?? ""
          }
        });

        return { message: "You have updated your overtime for today!", overtime }
      }

      const overtime = await this.prisma.overtimes.create({
        data: {
          userId: user.id,
          date: today,
          hours: data.hours,
          amount: overtimePay,
          reason: data?.reason ?? ""
        }
      })

      return { message: "You have submitted your overtime for today!", overtime }
    } catch (error) {
      this.logger.error(this.submitOvertime.name, error?.message);
      throw new HttpException(error.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private calculateOvertimePay(monthlySalary: number, overtimeHours: number) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const workDaysPerMonth = countWeekdaysInMonth(year, month);
    const hourlyRate = monthlySalary / (workDaysPerMonth * workingHours);
    const overtimePay = overtimeHours * hourlyRate * 2;
    return Math.round(overtimePay);
  }

  async submitReimburse(user: IUserData, data: SubmitReimburseDTO, file: Express.Multer.File) {
    try {
      const filePath: string = this.filePath + file.filename;

      const reimburse = await this.prisma.reimbursements.create({
        data: {
          userId: user.id,
          amount: Number(data.amount),
          description: data.description,
          link: filePath
        }
      })

      return { message: "You have submitted your reimbursement!", reimburse }
    } catch (error) {
      this.logger.error(this.submitReimburse.name, error?.message);
      throw new HttpException(error.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}