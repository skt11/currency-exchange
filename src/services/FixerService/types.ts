import { Either } from 'fp-ts/lib/Either';
import { LooseObject } from '../../globalTypes';

export type FixerServiceError = 'Error while fetching exchange rates.';

export interface IFixerService {
    getExchangeRate(
        baseCurrency: string,
        targetCurrency: string
    ): Promise<Either<number, FixerServiceError>>;
    getExchangeRates(
        baseCurrencies: string[],
        targetCurrencies: string[]
    ): Promise<Either<LooseObject, FixerServiceError>>;
}
