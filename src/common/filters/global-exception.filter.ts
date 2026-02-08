import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtil } from '../utils/response.util';
import { ErrorCode } from '../enums/error-code.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let code = ErrorCode.INTERNAL_ERROR;
        let details: any = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || responseObj.error || message;
                details = responseObj.details;
            }

            // Map HTTP status to error codes
            switch (status) {
                case HttpStatus.UNAUTHORIZED:
                    code = ErrorCode.UNAUTHORIZED;
                    break;
                case HttpStatus.FORBIDDEN:
                    code = ErrorCode.FORBIDDEN;
                    break;
                case HttpStatus.NOT_FOUND:
                    code = ErrorCode.NOT_FOUND;
                    break;
                case HttpStatus.CONFLICT:
                    code = ErrorCode.CONFLICT;
                    break;
                case HttpStatus.BAD_REQUEST:
                    code = ErrorCode.VALIDATION_ERROR;
                    break;
                default:
                    code = ErrorCode.INTERNAL_ERROR;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            details = {
                stack: process.env.NODE_ENV === 'development' ? exception.stack : undefined,
            };
        }

        const errorResponse = ResponseUtil.error(message, code, details);

        response.status(status).json(errorResponse);
    }
}
