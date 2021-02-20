import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SendEmailDto } from './send-email.dto';

/**
 * Defines API for sending email. For the test, I've just created an API for sending emails as there is no requirement
 * to check message delivery status. However, more elaborative API design can include support for creating  draft messages,
 * checking message sent status, sending message after delay etc.
 *
 * @author apaila
 * @version 1.0.0
 */
@ApiTags('emails')
@Controller('emails')
export class EmailController {
  constructor() {
    //
  }

  /**
   * Validates send email request and will initiate the process for delivery. This API doesn't accept bulk email requests but it
   * can be easily achieved by accepting an array of email requests in the input.
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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiConsumes('application/json')
  async sendEmail(@Body() smDto: SendEmailDto): Promise<void> {
    throw new NotFoundException();
  }
}
