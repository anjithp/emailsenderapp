import { HttpModule, Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { PubsubClient } from './pubsub-client';
import { EmailSenderClient } from './sender/email-sender-client';
import { MailjetEmailSender } from './sender/mailjet-email-sender';
import { SendgridEmailSender } from './sender/send-grid-email-sender';

@Module({
  imports: [HttpModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    MailjetEmailSender,
    SendgridEmailSender,
    EmailSenderClient,
    PubsubClient,
  ],
})
export class EmailModule {}
