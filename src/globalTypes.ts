import express from 'express';
import { JWTData } from './services/AuthService/types';

export abstract class ExternalService {
    protected _API_KEY?: string;
    protected _BASE_URL: string;

    constructor(BASE_URL: string, API_KEY?: string) {
        this._API_KEY = API_KEY;
        this._BASE_URL = BASE_URL;
    }
}

export type LooseObject = {
    [key: string]: any;
};

export type ExpressMiddlewareFunction = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => void;
