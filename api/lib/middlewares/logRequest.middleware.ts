import { Request, Response, NextFunction } from 'express';

const logRequest = (request: Request, response: Response, next: NextFunction) => {
    console.log(`[${request.method}] ${request.url} at ${new Date().toISOString()}`);
    next();
};


export default logRequest;