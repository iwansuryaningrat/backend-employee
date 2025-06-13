import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@app/common/database/prisma.service";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { LoginDTO } from "src/dtos/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
  ) { }

  private readonly logger = new Logger(AuthService.name);

  async login(data: LoginDTO) {
    try {
      const { email, password } = data;
      const user = await this.prismaService.users.findUnique({
        where: { email },
      });
      if (!user) throw new NotFoundException("User not found!");
      if (!this.authHelper.isPasswordValid(password, user.password)) throw new BadRequestException("Password is incorrect!");
      delete user.password;

      const { accessToken, refreshToken } = await this.authHelper.generateTokens(user.id, {
        name: user.name,
        role: user.role,
        email: user.email,
        username: user.username,
      });

      return {
        user,
        accessToken,
        refreshToken
      }
    } catch (error) {
      this.logger.error(this.login.name, error?.message);
      throw new HttpException(error.message, error?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}