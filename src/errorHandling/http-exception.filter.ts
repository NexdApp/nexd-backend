import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpConflictResponse } from './httpConflictResponse.model';
import { HttpConflictErrors } from './httpConflictErrors.type';
import { HttpBadRequestResponse } from './httpBadRequestResponse.model';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === HttpStatus.CONFLICT) {
      const errorCodeString: string = this.getErrorType(
        exception.getResponse(),
      );
      const description: string = this.getErrorDescription(
        exception.getResponse(),
      );
      const responseJson: HttpConflictResponse = {
        statusCode: 409,
        errors: [
          {
            errorCode: errorCodeString as HttpConflictErrors,
            errorDescription: description,
          },
        ],
      };
      response.status(status).json(responseJson);
      return;
    }

    if (status === HttpStatus.BAD_REQUEST) {
      const errorResponse: any = exception.getResponse();
      const errors = errorResponse.message.map(err => ({
        errorCode: err,
        errorDescription: err,
      }));

      const responseJson: HttpBadRequestResponse = {
        statusCode: 409,
        errors,
      };
      response.status(status).json(responseJson);
      return;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorType(exceptionResponse) {
    if (typeof exceptionResponse.message === 'string') {
      return exceptionResponse.message;
    }
    return exceptionResponse.type;
  }

  private getErrorDescription(exceptionResponse) {
    if (typeof exceptionResponse.message === 'string') {
      return '';
    }
    return exceptionResponse.description;
  }
}
