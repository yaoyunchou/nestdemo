import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse, ListResponse } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // 检查是否是分页数据结构
        if (data && data.list && typeof data.total !== 'undefined') {
          return {
            code: 0,
            message: 'success',
            result: {
              list: data.list,
              total: data.total,
              page: data.page || 1,
              pageSize: data.pageSize || 10
            } as ListResponse<T>
          };
        }
        
        // 普通响应结构
        return {
          code: 0,
          message: 'success',
          result: data
        };
      }),
    );
  }
} 