import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

export const init = () => {
    // GraphQL schema
    const schema = buildSchema(`
    type Query {
        message: String
    }
    `);
    // Root resolver
    const root = {
        message: () => 'Hello World!',
    };
    // Create an express server and a GraphQL endpoint
    const app = express();
    app.use(
        '/graphql',
        graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true,
        })
    );

    app.listen(4000, () =>
        console.log(
            'Express GraphQL Server Now Running On localhost:4000/graphql'
        )
    );
};
