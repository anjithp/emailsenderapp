import * as ps from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GCP_PROJECT_ID } from './constants';

//Create a separate class for pubsub client to make testing/mocking easier
@Injectable()
export class PubsubClient {
  private readonly _instance: ps.PubSub;

  constructor(readonly configService: ConfigService) {
    this._instance = new ps.PubSub({
      projectId: this.configService.get(GCP_PROJECT_ID),
    });
  }

  get instance(): ps.PubSub {
    return this._instance;
  }
}
