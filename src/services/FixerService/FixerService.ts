import axios from 'axios';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { ExternalService, LooseObject } from '../../globalTypes';
import { FixerServiceError, IFixerService } from './types';

export class FixerService extends ExternalService implements IFixerService {
    constructor(BASE_URL: string, API_KEY: string) {
        super(BASE_URL, API_KEY);
    }

    async getExchangeRate(
        baseCurrency: string,
        targetCurrency: string
    ): Promise<Either<LooseObject, FixerServiceError>> {
        try {
            const response = await axios.get(this._BASE_URL + '/latest', {
                params: {
                    access_key: this._API_KEY,
                    base: baseCurrency,
                    symbols: targetCurrency,
                },
            });
            return left(response.data);
        } catch (e) {
            console.log(e);
            return right('Error while fetching exchange rates.');
        }
    }

    async getExchangeRates(
        baseCurrencies: string[],
        targetCurrencies: string[]
    ): Promise<Either<LooseObject, FixerServiceError>> {
        const targetCurrenciesString = targetCurrencies.join(',');

        const exchangeRatePromises = baseCurrencies.map((currency: string) => {
            return new Promise(async (resolve, reject) => {
                const response = await this.getExchangeRate(
                    currency,
                    targetCurrenciesString
                );
                if (isLeft(response)) {
                    resolve(response.left);
                }
                reject('Failed to fetch rates.');
            });
        });

        try {
            const settledPromises = await Promise.allSettled(
                exchangeRatePromises
            );
            console.log(settledPromises);
            return left(
                settledPromises.map((res) =>
                    res.status === 'fulfilled' ? res.value : 'not found'
                )
            );
        } catch (e) {
            return right('Error while fetching exchange rates.');
        }
    }
}
