import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BaseResponse<ListResponse<T>>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<ListResponse<T>>> {
    return next.handle().pipe(
      map(data => {
        // 检查是否是分页数据结构
        if (data && data.list && typeof data.total !== 'undefined') {
          return {
            code: 0,
            message: 'success',
            data: {
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
          data: data
        };
      }),
    );
  }
} 