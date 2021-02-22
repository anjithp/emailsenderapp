import { Module } from '@nestjs/common';
import { PubsubClient } from './pubsub/pubsub-client';

@Module({
  providers: [PubsubClient],
  exports: [PubsubClient],
})
/* Root module of the application */
export class CommonModule {}
