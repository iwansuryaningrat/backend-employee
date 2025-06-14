import { join } from 'path';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthHelper } from '@app/common/helpers';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './services/auth.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeeService } from './services/employee.service';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { EmployeeController } from './controllers/employee.controller';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register({
      ttl: 30 * 1000, // 5 seconds
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
    EmployeeController,
  ],
  providers: [
    AuthHelper,
    AuthService,
    EmployeeService,
  ],
})
export class AppModule { }
