import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import { AuthService } from '../../services/AuthService/AuthService';
import { getLoginResolver } from './resolver';

export const getLoginSchema = (authService: AuthService): GraphQLSchema =>
    makeExecutableSchema({
        typeDefs: `
    type LoginResponse {
        token: String!
    }
    type Mutation {
        login(id: String!): LoginResponse!
    }
    type Query {
        name: String!
    }
 `,
        resolvers: getLoginResolver(authService),
    });
