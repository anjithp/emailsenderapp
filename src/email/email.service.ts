import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailRequestDto } from './email-request.dto';
import { Subscription } from '@google-cloud/pubsub';
import { EmailSenderClient } from './sender/email-sender-client';
import { PubsubClient } from '../common/pubsub/pubsub-client';
import {
  GCP_PUBSUB_SUBSCRIPTION_ID,
  GCP_PUBSUB_TOPIC_ID,
} from '../common/pubsub/constants';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private emailListener: Subscription;

  constructor(
    private readonly configService: ConfigService,
    private readonly esClient: EmailSenderClient,
    private readonly pubsubClient: PubsubClient,
  ) {
    this.setupEmailSubscription();
  }

  /**
   * persists email request on GCP pubsub queue. Email message will later be picked by subscription
   * which will attempt to deliver until successful. Pubsub will guarantee delivery until the message
   * has been acknowledged.
   * @param smDto send email input request
   */
  async saveEmail(smDto: EmailRequestDto): Promise<void> {
    try {
      this.logger.debug('Saving email request to pubsub');
      await this.pubsubClient.instance
        .topic(this.configService.get(GCP_PUBSUB_TOPIC_ID))
        .publishJSON(smDto);
      //setup subscription if not done already
      if (!this.emailListener || !this.emailListener.isOpen) {
        this.setupEmailSubscription();
      }
    } catch (err) {
      this.logger.error(
        `Error occurred while publishing email to pubsub topic ${this.configService.get(
          GCP_PUBSUB_TOPIC_ID,
        )}`,
      );
      throw new InternalServerErrorException();
    }
  }

  private async setupEmailSubscription(): Promise<void> {
    try {
      const subResp = await this.pubsubClient.instance.getSubscriptions(
        this.configService.get(GCP_PUBSUB_SUBSCRIPTION_ID),
      );
      if (subResp) {
        this.emailListener = subResp[0][0];
        // Receive callbacks for new messages on the subscription
        this.emailListener.on('message', this.onEmailMessageReceived);
        this.emailListener.on('close', this.onSubscriptionClose);
      }
    } catch (err) {
      this.logger.error(
        `Error occurred while setting up subscription with ID ${this.configService.get(
          GCP_PUBSUB_SUBSCRIPTION_ID,
        )}`,
      );
    }
  }

  onEmailMessageReceived = async (message: any): Promise<void> => {
    const erd = JSON.parse(message.data);
    try {
      this.logger.debug('Message received from pubusb');
      await this.esClient.sendEmail(erd);
      //acknowledge the message so it will be deleted from pubsub
      message.ack();
    } catch (err) {
      //just report the error and don't acknowledge the message so that it will be redeliverd again
      this.logger.error(
        `Error occurred while sending an email ${err}. Stack: ${err.stack}`,
      );
    }
  };

  onSubscriptionClose = (): void => {
    this.emailListener = null;
    this.logger.warn(
      `Subscription ${this.configService.get(
        GCP_PUBSUB_SUBSCRIPTION_ID,
      )} has been closed`,
    );
  };
}
