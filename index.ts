import { Server } from './src/server/server';

import { buildSchema } from 'graphql';
import { AuthService } from './src/services/AuthService/AuthService';
import { isLeft } from 'fp-ts/lib/Either';

const authService = new AuthService(
    process.env.JWT_SECRET ? process.env.JWT_SECRET : ''
);

const server = new Server();

console.log(process.env.JWT_SECRET);

// GraphQL schema
const schema = buildSchema(`
 type Query {
     message: String
 }
 `);
const loginSchema = buildSchema(`
 type Query {
     name: String!
 }
 type Mutation {
     login(id: String!): String!
 }
 `);
// Root resolver
const root = {
    message: () => 'Hello World!',
};

const loginResolver = {
    login: ({ id }: { id: string }) => {
        console.log(id);
        const tokenRes = authService.createToken({ userId: id });
        if (isLeft(tokenRes)) {
            authService.authenticateToken(tokenRes.left);
            return tokenRes.left;
        }
    },
    name: () => 'Login',
};

server
    .addGraphqlEndpoint('/graphql', {
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
    .addGraphqlEndpoint('/login', {
        schema: loginSchema,
        rootValue: loginResolver,
        graphiql: true,
    });

server.start(4000, () => {
    console.log('Server started at 4000');
});
