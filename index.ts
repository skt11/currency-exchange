import { Server } from './src/server/server';
import { AuthService } from './src/services/AuthService/AuthService';
import { getLoginSchema } from './src/schema/login/schema';
import { RestCountriesService } from './src/services/RestCountriesService/RestCountriesService';
import { getCurrencyExchangeSchema } from './src/schema/currencyExchange/schema';
import { FixerService } from './src/services/FixerService/FixerService';
import { ExchangeRateService } from './src/services/ExchangeRateService/ExchangeRateService';
import { rateLimit } from 'express-rate-limit';

const authService = new AuthService(
    process.env.JWT_SECRET ? process.env.JWT_SECRET : ''
);

const restCountriesService = new RestCountriesService(
    process.env.RESTCOUNTRIES_BASE_URL ? process.env.RESTCOUNTRIES_BASE_URL : ''
);

const fixerService = new FixerService(
    process.env.FIXER_BASE_URL ? process.env.FIXER_BASE_URL : '',
    process.env.FIXER_API_KEY ? process.env.FIXER_API_KEY : ''
);

const exchangeRateService = new ExchangeRateService(
    restCountriesService,
    fixerService
);

const server = new Server();

server
    .addGraphqlEndpoint('/login', [], {
        schema: getLoginSchema(authService),
        graphiql: true,
    })
    .addGraphqlEndpoint(
        '/api',
        [
            rateLimit({
                windowMs: 60 * 1000, // 1 minutes
                max: 30, // Limit each IP to 30 requests per minute
                standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
                legacyHeaders: false,
            }),
            authService.getAuthMiddleWare(),
        ],
        {
            schema: getCurrencyExchangeSchema(exchangeRateService),
            graphiql: true,
        }
    );

server.start(4000, () => {
    console.log('Server started at 4000');
});
