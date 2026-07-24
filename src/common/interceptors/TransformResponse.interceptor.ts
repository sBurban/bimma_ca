import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Captures Response message or empty string
        const message = data?.message ?? '';
        if (data && data.message) {
          delete data.message;
        }
        const ctx = context.getType();
        // Formats REST endpoints
        if (ctx === 'http') {
          // Maps Response to new format
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            reqId: context.switchToHttp().getRequest().reqId,
            message,
            data,
          };
        }

        return data; // Returns default response for GraphQL
      }),
    );
  }
}
