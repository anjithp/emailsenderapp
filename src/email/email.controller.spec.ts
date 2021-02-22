import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { EmailSenderClient } from './sender/email-sender-client';
import { BadRequestException, HttpStatus } from '@nestjs/common';

/** Wrote some tests to demonstrate testing approach. More tests can be added */
describe('EmailController', () => {
  let controller: EmailController;
  const serviceMock: Partial<EmailService> = { saveEmail: jest.fn() };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        { provide: EmailService, useValue: serviceMock },
        ConfigService,
        EmailSenderClient,
      ],
    }).compile();

    controller = app.get<EmailController>(EmailController);
  });

  describe('root', () => {
    it('should accept email request', async () => {
      const respMock = jest.fn();
      respMock.mockReturnValue({ send: jest.fn() });
      expect(
        await controller.handleSendEmailRequest(
          { to: ['test1@test.com'], subject: 'test' },
          ({ status: respMock } as unknown) as Response,
        ),
      ).toBeUndefined();
      expect(respMock).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
    });

    it('should throw an error when cc and bcc does not have unique email addresses', async () => {
      const respMock = jest.fn();
      respMock.mockReturnValue({ send: jest.fn() });
      expect(
        controller.handleSendEmailRequest(
          {
            to: ['test1@test.com'],
            subject: 'test',
            cc: ['test@test.com'],
            bcc: ['test@test.com'],
          },
          ({ status: respMock } as unknown) as Response,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
