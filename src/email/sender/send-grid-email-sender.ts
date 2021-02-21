import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailRequestDto } from '../email-request.dto';
import { EmailSender } from './email-sender.interface';

/**
 * sends email using SendGrid platform
 */
@Injectable()
export class SendgridEmailSender implements EmailSender {
  readonly name = SendgridEmailSender.name;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async sendEmail(emailRequest: EmailRequestDto): Promise<void> {
    const inputBody = {
      personalizations: [
        {
          to: emailRequest.to.map((e) => ({
            email: e,
          })),
          cc:
            emailRequest.cc && emailRequest.cc.length > 0
              ? emailRequest.cc.map((e) => ({
                  email: e,
                }))
              : emailRequest.cc,
          bcc:
            emailRequest.bcc && emailRequest.bcc.length > 0
              ? emailRequest.bcc.map((e) => ({
                  email: e,
                }))
              : emailRequest.bcc,
        },
      ],
      from: {
        email: 'anjith.p@gmail.com',
      },
      subject: emailRequest.subject,
      content: [
        {
          type: 'text/plain',
          value: emailRequest.textContent,
        },
      ],
    };
    await this.httpService
      .post(
        `${this.configService.get('SENDGRID_BASE_URL')}/mail/send`,
        inputBody,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'SENDGRID_API_KEY',
            )}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .toPromise();
  }
}
