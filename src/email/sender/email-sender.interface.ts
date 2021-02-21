import { EmailRequestDto } from '../email-request.dto';

export interface EmailSender {
  readonly name: string;
  sendEmail(emailRequest: EmailRequestDto): Promise<void>;
}
