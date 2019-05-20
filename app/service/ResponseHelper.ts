import { Service } from 'egg';

interface Response {
    success: boolean;
    message: string;
    statusCode: StatueCode;
    [key: string]: any;
}

const message = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
};

export default class ResponseHelper extends Service {
    /**
     * @description 用于拼装错误请求的返回体
     * @param {StatueCode} statusCode - Http status code.
     * @param {any} [data] - Custom response body.
     * @return {Response} - Response body.
     */
    public getResponseByStatusCode(statusCode: StatueCode, data?: any): Response {
        return {
            success: !(statusCode >= 400),
            message: message[statusCode],
            statusCode,
            ...data,
        };
    }
}
