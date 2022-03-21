import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { FixerService } from '../FixerService/FixerService';
import { RestCountriesService } from '../RestCountriesService/RestCountriesService';
import {
    CountryDetails,
    CurrencyExchangeRate,
    ExchangeRateServiceError,
    IExchangeRateService,
} from './types';

export class ExchangeRateService implements IExchangeRateService {
    private _restCountriesService: RestCountriesService;
    private _fixerService: FixerService;

    constructor(
        restCountriesService: RestCountriesService,
        fixerService: FixerService
    ) {
        this._fixerService = fixerService;
        this._restCountriesService = restCountriesService;
    }

    async getExchangeRatesByCountryName(
        countryName: string,
        targetCurrency: string
    ): Promise<Either<CountryDetails[], ExchangeRateServiceError>> {
        const restCountriesResponse =
            await this._restCountriesService.getCountryDetailsByName(
                countryName
            );

        if (isLeft(restCountriesResponse)) {
            const restCountriesList = restCountriesResponse.left;
            const countryDetailsList: CountryDetails[] = [];

            for (let index in restCountriesList) {
                const exchangeRatePromiseList = Object.keys(
                    restCountriesList[index].currencies
                ).map((curr: string) =>
                    this._getExchangeRateByEURBase(curr, targetCurrency)
                );

                const currencyExchangeRates = await Promise.all(
                    exchangeRatePromiseList
                );

                countryDetailsList.push({
                    fullName: restCountriesList[index].name.official,
                    population: restCountriesList[index].population,
                    currencyExchangeRates,
                });
            }

            return left(countryDetailsList);
        }

        return right('Failed to fetch country data.');
    }

    private async _getExchangeRateByEURBase(
        baseCurrency: string,
        targetCurrency: string
    ): Promise<CurrencyExchangeRate> {
        const exchangeRateResponseBase =
            await this._fixerService.getExchangeRate('EUR', baseCurrency);
        const exchangeRateResponseTarget =
            await this._fixerService.getExchangeRate('EUR', targetCurrency);

        if (
            isLeft(exchangeRateResponseBase) &&
            isLeft(exchangeRateResponseTarget)
        ) {
            return {
                currency: baseCurrency,
                targetCurrency,
                rate:
                    exchangeRateResponseTarget.left.rates[
                        targetCurrency.toUpperCase()
                    ] /
                    exchangeRateResponseBase.left.rates[
                        baseCurrency.toUpperCase()
                    ],
            };
        }
        return {
            currency: baseCurrency,
            targetCurrency,
            rate: 'Not Found',
        };
    }
}
