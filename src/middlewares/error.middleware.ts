import express from "express";

export const errorMiddleware = (
    error: Error & { status?: number; errors: unknown[]},
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction) => {
    const status = error.status ?? 500;
    res.status(status).json({
        message: error.message,
        errors: error.errors,
    });
    return;
};