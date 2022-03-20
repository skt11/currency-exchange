import { Server } from './src/server/server';
import { AuthService } from './src/services/AuthService/AuthService';
import { getLoginSchema } from './src/schema/login/schema';
import { RestCountriesService } from './src/services/RestCountriesService/RestCountriesService';
import { getCurrencyExchangeSchema } from './src/schema/currencyExchange/schema';
import { FixerService } from './src/services/FixerService/FixerService';
import { isLeft } from 'fp-ts/lib/Either';

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

fixerService.getExchangeRates(['INR'], ['SEK', 'USD', 'INR']).then((res) => {
    if (isLeft(res)) {
        console.log(res.left);
    }
});

const server = new Server();

server
    .addGraphqlEndpoint('/api', {
        schema: getCurrencyExchangeSchema(),
        graphiql: true,
    })
    .addGraphqlEndpoint('/login', {
        schema: getLoginSchema(authService),
        graphiql: true,
    });

server.start(4000, () => {
    console.log('Server started at 4000');
});
