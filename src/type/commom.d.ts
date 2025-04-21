// ts 命名空间




interface BaseResponse<T> {
    code: number;
    data: T | ListResponse<T>;
    message?: string;
    msg?: string;
}

interface ListResponse<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

