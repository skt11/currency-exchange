import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import { getCurrencyExchangeResolver } from './resolver';

export const getCurrencyExchangeSchema = (): GraphQLSchema =>
    makeExecutableSchema({
        typeDefs: `
    type CurrencyExchangeRate{
        currency: String!
        rate: Float!
        targetCurrency: String!
    }
    type CountryDetails{
        fullName: String!
        population: Int!
        currencyExchangeRates: [CurrencyExchangeRate]!
    }
    type Query {
        countryDetails(name: String!): [CountryDetails]!
    }
 `,
        resolvers: getCurrencyExchangeResolver(),
    });
