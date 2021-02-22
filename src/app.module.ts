import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

import { EmailModule } from './email/email.module';

@Module({
  imports: [
    EmailModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
/* Root module of the application */
export class AppModule {}
