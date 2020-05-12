import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BackendErrorResponse } from './BackendErrorEntry.model';
import { BackendErrors } from './backendErrors.type';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const errorResponse: any = exception.getResponse();
      if (typeof errorResponse.message === 'string') {
        errorResponse.message = [errorResponse.message];
      }
      const errors = errorResponse.message.map(err => ({
        errorCode: err,
        errorDescription: err,
      }));

      const responseJson: BackendErrorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        errors,
      };
      response.status(status).json(responseJson);
      return;
    }

    const errorCodeString: string = this.getErrorType(exception.getResponse());
    const description: string = this.getErrorDescription(
      exception.getResponse(),
    );
    const responseJson: BackendErrorResponse = {
      statusCode: status,
      errors: [
        {
          errorCode: errorCodeString as BackendErrors,
          errorDescription: description,
        },
      ],
    };
    response.status(status).json(responseJson);
    return;
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
