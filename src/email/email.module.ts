import { HttpModule, Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailSenderClient } from './sender/email-sender-client';
import { MailjetEmailSender } from './sender/mailjet-email-sender';
import { SendgridEmailSender } from './sender/send-grid-email-sender';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [HttpModule, CommonModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    MailjetEmailSender,
    SendgridEmailSender,
    EmailSenderClient,
  ],
})
export class EmailModule {}
