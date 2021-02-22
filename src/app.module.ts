import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailModule } from './email/email.module';

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
/* Root module of the application */
export class AppModule {}
