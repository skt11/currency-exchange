import { isLeft } from 'fp-ts/lib/Either';
import { ExchangeRateService } from '../../services/ExchangeRateService/ExchangeRateService';

export const getCurrencyExchangeResolver = (
    exchangeRateService: ExchangeRateService
) => ({
    Query: {
        countryDetails: async (
            _: any,
            { name, targetCurrency }: { name: string; targetCurrency: string },
            info: any
        ) => {
            //Check if rate limit is enabled
            if (info.rateLimit && info.rateLimit.remaining === 0) {
                throw new Error(
                    `Request limit exceeded, retry at ${info.rateLimit.resetTime}`
                );
            }

            const exchangeRateResponse =
                await exchangeRateService.getExchangeRatesByCountryName(
                    name,
                    targetCurrency
                );

            if (isLeft(exchangeRateResponse)) {
                return exchangeRateResponse.left;
            }

            throw new Error(exchangeRateResponse.right);
        },
    },
});
