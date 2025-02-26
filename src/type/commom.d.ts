// ts 命名空间




interface BaseResponse<T> {
    code: number;
    data: T | T[];
    message?: string;
    msg?: string;
}