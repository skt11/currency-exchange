import { Server } from './src/server/server';
import { AuthService } from './src/services/AuthService/AuthService';
import { getLoginSchema } from './src/schema/login/schema';
import { RestCountriesService } from './src/services/RestCountriesService/RestCountriesService';
import { getCurrencyExchangeSchema } from './src/schema/currencyExchange/schema';

const authService = new AuthService(
    process.env.JWT_SECRET ? process.env.JWT_SECRET : ''
);

const restCountriesService = new RestCountriesService(
    process.env.RESTCOUNTRIES_BASE_URL ? process.env.RESTCOUNTRIES_BASE_URL : ''
);

restCountriesService
    .getCountryDetailsByName('peru')
    .then((r) => console.log(r))
    .catch((e) => console.log(e));

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
