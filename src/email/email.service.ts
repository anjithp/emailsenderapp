import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as ps from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';
import { EmailRequestDto } from './email-request.dto';
import { Optional } from '@nestjs/common';
import { Subscription } from '@google-cloud/pubsub';
import { EmailSenderClient } from './sender/email-sender-client';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private emailListener: Subscription;

  constructor(
    private readonly configService: ConfigService,
    private readonly esClient: EmailSenderClient,
    @Optional()
    private pubsub = new ps.PubSub({ projectId: process.env.GCP_PROJECT_ID }),
  ) {
    this.setupEmailSubscription();
  }

  /**
   * persists email rquest on GCP pubsub queue. Email message will later be picked by subscription
   * which will attempt to deliver until successful.
   * @param smDto send email input request
   */
  async saveEmail(smDto: EmailRequestDto): Promise<void> {
    try {
      await this.pubsub
        .topic(this.configService.get('GCP_PUBSUB_TOPIC_ID'))
        .publishJSON(smDto);
      //setup subscription if not done already
      if (!this.emailListener || !this.emailListener.isOpen) {
        this.setupEmailSubscription();
      }
    } catch (err) {
      this.logger.error(
        `error occurred while publishing email to pubsub topic ${this.configService.get(
          'GCP_PUBSUB_TOPIC_ID',
        )}`,
      );
      throw new InternalServerErrorException();
    }
  }

  private async setupEmailSubscription(): Promise<void> {
    try {
      const subResp = await this.pubsub.getSubscriptions(
        this.configService.get('GCP_PUBSUB_SUBSCRIPTION_ID'),
      );
      this.emailListener = subResp[0][0];
      // Receive callbacks for new messages on the subscription
      this.emailListener.on('message', this.onEmailMessageReceived);
      this.emailListener.on('close', this.onSubscriptionClose);
    } catch (err) {
      this.logger.error(
        `error occurred while setting up subscription with ID ${this.configService.get(
          'GCP_PUBSUB_SUBSCRIPTION_ID',
        )}`,
      );
    }
  }

  onEmailMessageReceived = async (message: any): Promise<void> => {
    const erd = JSON.parse(message.data);
    try {
      await this.esClient.sendEmail(erd);
      //acknowledge the message so it won't be redelivered
      message.ack();
    } catch (err) {
      //just report the error and don't acknowledge the message so that it will be redeliverd again
      this.logger.error(`error occurred while sending an email ${err}`);
    }
  };

  onSubscriptionClose = (): void => {
    this.emailListener = null;
    this.logger.warn(
      `Subscription ${this.configService.get(
        'GCP_PUBSUB_SUBSCRIPTION_ID',
      )} has been closed`,
    );
  };
}
