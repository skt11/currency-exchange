import { Options } from 'express-graphql';

export interface IServer {
    start(port: number, callback?: () => void): IServer;
}

export interface IGqlServer {
    addGraphqlEndpoint(
        path: string,
        middlewares: any,
        gqlOptions: Options
    ): IGqlServer;
}
