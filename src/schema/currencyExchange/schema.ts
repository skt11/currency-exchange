import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import { ExchangeRateService } from '../../services/ExchangeRateService/ExchangeRateService';
import { getCurrencyExchangeResolver } from './resolver';

export const getCurrencyExchangeSchema = (
    exchangeRateService: ExchangeRateService
): GraphQLSchema =>
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
        countryDetails(name: String!, targetCurrency: String!): [CountryDetails]!
    }
 `,
        resolvers: getCurrencyExchangeResolver(exchangeRateService),
    });
