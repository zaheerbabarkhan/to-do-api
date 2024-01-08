export class HttpError extends Error {
    status: number;
    message: string;
    constructor(statusCode: number, message: string) {
        super();
        this.status = statusCode;
        this.message = message;
    }
}