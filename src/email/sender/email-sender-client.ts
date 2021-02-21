import { Logger, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EmailRequestDto } from '../email-request.dto';
import { EmailSender } from './email-sender.interface';
import { MailjetEmailSender } from './mailjet-email-sender';
import { SendgridEmailSender } from './send-grid-email-sender';

/** client class for sending emails. maintains multiple implementations of email senders for
 * fault-tolerance
 */
@Injectable()
export class EmailSenderClient implements OnModuleInit {
  private readonly logger = new Logger(EmailSenderClient.name);
  private readonly senders: EmailSender[] = [];

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.senders.push(this.moduleRef.get(SendgridEmailSender));
    this.senders.push(this.moduleRef.get(MailjetEmailSender));
  }

  async sendEmail(emailRequest: EmailRequestDto): Promise<void> {
    //here we are just going through senders list by index to keep it simple
    //but it can be changed to another strategy like choosing randomly, active-passive etc.
    for (let i = 0; i < this.senders.length; i++) {
      const sender = this.senders[i];
      try {
        this.logger.debug(`trying to send email using provider ${sender.name}`);
        await sender.sendEmail(emailRequest);
        break;
      } catch (err) {
        this.logger.error(
          `error occurred while sending an email using provider ${sender.name}: ${err}`,
        );
        if (i === this.senders.length - 1) {
          //all senders are failing, hence throw an exception
          throw err;
        }
      }
    }
  }
}