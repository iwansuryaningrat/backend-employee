import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../database/prisma.service";
import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthHelper {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) { }

  // Validate token
  public validateToken(token: string) {
    const decoded = this.jwtService.verify(token, { secret: this.configService.get("JWT_SECRET") });
    return decoded;
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<any> {
    const user = await this.prismaService.users.findUnique({
      where: { id: decoded._id },
    });

    return user;
  }

  // Generate JWT Token
  public async generateTokens(
    userId: number,
    data: { name: string; role: string; email?: string; username?: string },
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          _id: userId,
          ...data,
        },
        {
          secret: this.configService.get("JWT_SECRET"),
          expiresIn: "1d",
        },
      ),
      this.jwtService.signAsync(
        {
          _id: userId,
          ...data,
        },
        {
          secret: this.configService.get("JWT_SECRET"),
          expiresIn: "3d",
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async validate(token: string): Promise<any> {
    const decoded: unknown = this.jwtService.verify(token);
    if (!decoded) throw new UnauthorizedException("User Unauthorized!", { cause: new Error(), description: "User Unauthorized!" })

    const user = await this.validateUser(decoded);
    if (!user) throw new UnauthorizedException("User Unauthorized!", { cause: new Error(), description: "User Unauthorized!" })

    return {
      isValid: true,
      user
    };
  }
}
