import express from 'express';
import { graphqlHTTP, Options } from 'express-graphql';
import { IGqlServer, IServer } from './types';
export class Server implements IServer, IGqlServer {
    private _app: express.Application;

    constructor() {
        this._app = express();
    }

    get app() {
        return this._app;
    }

    start(port: number, callback?: () => void): Server {
        this._app.listen(port, callback);
        return this;
    }

    addGraphqlEndpoint(path: string, gqlOptions: Options): Server {
        this._app.use(path, graphqlHTTP(gqlOptions));
        return this;
    }
}
