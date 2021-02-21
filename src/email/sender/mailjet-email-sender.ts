import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailRequestDto } from '../email-request.dto';
import { EmailSender } from './email-sender.interface';

/**
 * sends email using MailJet platform.
 */
@Injectable()
export class MailjetEmailSender implements EmailSender {
  readonly name = MailjetEmailSender.name;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async sendEmail(emailRequest: EmailRequestDto): Promise<void> {
    const inputBody = {
      Messages: [
        {
          FromEmail: 'anjith.p@gmail.com',
          Recipients: emailRequest.to.map((e) => ({
            Email: e,
          })),
          Cc:
            emailRequest.cc && emailRequest.cc.length > 0
              ? emailRequest.cc.map((e) => ({
                  Email: e,
                }))
              : emailRequest.cc,
          Bcc:
            emailRequest.bcc && emailRequest.bcc.length > 0
              ? emailRequest.bcc.map((e) => ({
                  Email: e,
                }))
              : emailRequest.bcc,
          Subject: emailRequest.subject,
          'Text-part': emailRequest.textContent,
        },
      ],
    };
    await this.httpService
      .post(`${this.configService.get('MAILJET_BASE_URL')}/send`, inputBody, {
        headers: {
          Authorization: `Basic ${this.configService.get('MAILJET_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      })
      .toPromise();
  }
}
