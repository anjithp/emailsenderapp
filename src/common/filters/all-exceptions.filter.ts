import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * Handles all errors/exceptions raised in the application and returns them in a uniform format.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let errors = [];
    if (exception instanceof HttpException) {
      if (Array.isArray((exception as any)?.getResponse()?.message)) {
        errors = (exception as any)?.getResponse()?.message;
      } else {
        errors.push((exception as any)?.getResponse()?.message);
      }
    } else {
      errors.push('Internal server error');
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors,
    });
  }
}
