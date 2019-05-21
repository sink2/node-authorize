declare type StatueCode = 200 | 201 | 202 | 400 | 401 | 403 | 404 | 409 | 500;

declare interface QueryParams {
    pageSize?: number;
    currentPage?: number;
    sort?: string;
    [key: string]: string;
}