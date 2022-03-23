import { Either } from 'fp-ts/lib/Either';
import { FixerServiceError } from '../FixerService/types';
import { RestCountriesServiceError } from '../RestCountriesService/types';

export type CurrencyExchangeRate = {
    currency: string;
    rate: number;
    targetCurrency: string;
};

export type CountryDetails = {
    fullName: string;
    population: number;
    currencyExchangeRates: CurrencyExchangeRate[];
};

export type ExchangeRateServiceError =
    | FixerServiceError
    | RestCountriesServiceError;

export interface IExchangeRateService {
    getExchangeRatesByCountryName(
        countryName: string,
        targetCurrency: string
    ): Promise<Either<CountryDetails[], ExchangeRateServiceError>>;
}
