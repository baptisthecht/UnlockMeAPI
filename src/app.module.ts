import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';

import { HealthModule } from './health/health.module';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    MailerModule,
    HealthModule,
    PhotoModule,
  ],
})
export class AppModule {}
