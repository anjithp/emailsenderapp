import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { EmailSenderClient } from './sender/email-sender-client';
import { PubsubClient } from '../common/pubsub/pubsub-client';

/** Wrote some tests to demonstrate testing approach. More tests can be added */
describe('EmailService', () => {
  let service: EmailService;
  //mock pubsub client
  const publishMock = jest.fn();
  const pubsubMock = {
    instance: {
      topic: () => ({ publishJSON: publishMock }),
      getSubscriptions: jest.fn(),
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        ConfigService,
        EmailSenderClient,
        { provide: PubsubClient, useValue: pubsubMock },
      ],
    }).compile();

    service = app.get<EmailService>(EmailService);
  });

  describe('root', () => {
    it('should save email', async () => {
      const emailListenerMock = jest.fn();
      pubsubMock.instance.getSubscriptions.mockReturnValue(
        Promise.resolve([[{ on: emailListenerMock }]]),
      );
      expect(
        await service.saveEmail({
          to: ['test1@test.com'],
          subject: 'test',
          textContent: 'test',
        }),
      ).toBeUndefined();
      expect(publishMock).toHaveBeenCalled();
      expect(emailListenerMock).toHaveBeenCalled();
    });

    it('should throw an error when pubsub is down', async () => {
      const emailListenerMock = jest.fn();
      pubsubMock.instance.getSubscriptions.mockReturnValue(
        Promise.resolve([[{ on: emailListenerMock }]]),
      );
      publishMock.mockRejectedValueOnce(new Error('test error'));
      expect(
        service.saveEmail({
          to: ['test1@test.com'],
          subject: 'test',
          textContent: 'test',
        }),
      ).rejects.toThrow();
    });
  });
});
