import { HttpStatus, Res, Logger, BadRequestException } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmailRequestDto } from './email-request.dto';
import { EmailService } from './email.service';

/**
 * Defines API for sending email. For the test, I've just created an API for sending emails as there is no requirement
 * to check message delivery status. However, more elaborative API design can include support for creating  draft messages,
 * checking message sent status, sending message after delay etc.
 */
@ApiTags('emails')
@Controller('emails')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);
  constructor(private readonly emailService: EmailService) {
    //
  }

  /**
   * Validates send email request and will initiate the process for delivery. This API doesn't accept bulk email requests
   * but it can be easily achieved by accepting an array of email requests in the input. Also 'from' email is hardcoded for
   * this test as mail providers aren't accepting unverified 'from' address.
   *
   * @param smDto send email input request
   */
  @Post()
  @ApiOperation({ description: 'Send email' })
  @ApiAcceptedResponse({
    description:
      'Send email request has been accepted and system will do multiple attempts to deliver.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiPayloadTooLargeResponse({
    description:
      'Input request is too large. Maximum supported email size is 10MB.',
  })
  @ApiConsumes('application/json')
  async handleSendEmailRequest(
    @Body() smDto: EmailRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    this.validateEmailRequestConstraints(smDto);
    await this.emailService.saveEmail(smDto);
    res.status(HttpStatus.ACCEPTED).send();
  }

  //can be moved to a separate helper class
  private validateEmailRequestConstraints(smDto: EmailRequestDto): void {
    const cc = smDto.cc || [];
    const bcc = smDto.bcc || [];
    if (cc.some((elm) => bcc.includes(elm))) {
      throw new BadRequestException(
        null,
        'cc and bcc must have unique email addresses',
      );
    }
  }
}
