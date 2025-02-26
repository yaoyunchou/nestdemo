export interface BaseResponse<T = any> {
  code: number | string;
  message: string;
  result: T;
}

export interface ListResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T = any> extends BaseResponse<ListResponse<T>> {} 