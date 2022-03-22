import { Options } from 'express-graphql';
import { ExpressMiddlewareFunction } from '../globalTypes';

export interface IServer {
    start(port: number, callback?: () => void): IServer;
}

export interface IGqlServer {
    addGraphqlEndpoint(
        path: string,
        middlewares: ExpressMiddlewareFunction[],
        gqlOptions: Options
    ): IGqlServer;
}
