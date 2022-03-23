import { Server } from './src/server/server';
import { AuthService } from './src/services/AuthService/AuthService';
import { getLoginSchema } from './src/schema/login/schema';
import { RestCountriesService } from './src/services/RestCountriesService/RestCountriesService';
import { getCurrencyExchangeSchema } from './src/schema/currencyExchange/schema';
import { FixerService } from './src/services/FixerService/FixerService';
import { ExchangeRateService } from './src/services/ExchangeRateService/ExchangeRateService';
import { rateLimit } from 'express-rate-limit';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

//Initialize services
const authService = new AuthService(process.env.JWT_SECRET || '');
const restCountriesService = new RestCountriesService(
    process.env.RESTCOUNTRIES_BASE_URL || ''
);
const fixerService = new FixerService(
    process.env.FIXER_BASE_URL || '',
    process.env.FIXER_API_KEY || ''
);
const exchangeRateService = new ExchangeRateService(
    restCountriesService,
    fixerService
);

//Init rate limiting
const rateLimitMiddleware = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW
        ? parseInt(process.env.RATE_LIMIT_WINDOW)
        : 60 * 1000, // 1 minutes
    max: process.env.RATE_MAX_LIMIT ? parseInt(process.env.RATE_MAX_LIMIT) : 30, // Limit each IP to 30 requests per minute
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
});

//Initialize gql endpoints and start the server.
const server = new Server();
server
    .addGraphqlEndpoint('/login', [], {
        schema: getLoginSchema(authService),
        graphiql: true,
    })
    .addGraphqlEndpoint(
        '/api',
        [rateLimitMiddleware, authService.getAuthMiddleWare()],
        {
            schema: getCurrencyExchangeSchema(exchangeRateService),
            graphiql: true,
        }
    )
    .addGraphqlEndpoint('/api-open', [rateLimitMiddleware], {
        schema: getCurrencyExchangeSchema(exchangeRateService),
        graphiql: true,
    });

server.start(port, () => {
    console.log(`Server started at ${port}`);
});
