import { PrismaService } from "@app/common/database/prisma.service";
import { IUserData } from "@app/common/interfaces/user.interface";
import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { AttendanceStatus, Role } from "@prisma/client";
import * as moment from "moment-timezone";
import { endWorkingTime, startWorkingTime } from "../constants";

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) { }

  private readonly logger = new Logger(EmployeeService.name);

  async submitAttendance(user: IUserData) {
    try {
      if (user.role !== Role.employee) throw new ForbiddenException("You are not an employee!");

      const date = moment(new Date()).tz('Asia/Jakarta');
      const today = date.format('DD-MM-YYYY');

      const dayOfWeek = date.day();
      // if (dayOfWeek === 0 || dayOfWeek === 6) throw new BadRequestException("You cannot submit attendance on weekends!");

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
}