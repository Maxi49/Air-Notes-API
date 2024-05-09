import {
  CallHandler,
  ExecutionContext,
  HttpException,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

export class ErrorHandlerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          throw new HttpException(err.getResponse(), err.getStatus(), {
            cause: err,
          });
        }
        throw new InternalServerErrorException(err, 'Unknown server error');
      }),
    );
  }
}
