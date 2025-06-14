import { join } from 'path';
import { AuthHelper } from './helpers';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './services/auth.service';
import { AdminService } from './services/admin.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeeService } from './services/employee.service';
import { AuthController } from './controllers/auth.controller';
import { AdminController } from './controllers/admin.controller';
import { EmployeeController } from './controllers/employee.controller';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register({
      ttl: 30 * 1000,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES") },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [
    AuthController,
    AdminController,
    EmployeeController,
  ],
  providers: [
    AuthHelper,
    AuthService,
    AdminService,
    EmployeeService,
  ],
})
export class AppModule { }
