import { isLeft } from 'fp-ts/lib/Either';
import { ExchangeRateService } from '../../services/ExchangeRateService/ExchangeRateService';

export const getCurrencyExchangeResolver = (
    exchangeRateService: ExchangeRateService
) => ({
    Query: {
        countryDetails: async (
            _: any,
            { name, targetCurrency }: { name: string; targetCurrency: string }
        ) => {
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
