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

            //Iterate through all the countries returned by this._restCountriesService.getCountryDetailsByName
            for (let index in restCountriesList) {
                const currencyList = Object.keys(
                    restCountriesList[index].currencies
                );

                //Execute the fixer service calls in parallel
                const exchangeRatePromiseList = currencyList.map(
                    (curr: string) =>
                        this._getExchangeRateByEURBase(curr, targetCurrency)
                );
                const currencyExchangeRates = await Promise.all(
                    exchangeRatePromiseList
                );

                //Push the desired data for each country to a list
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

    // exchangeRate = (targetExchangeRateFromEUR / baseExchangeRateFromEUR)
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
            exchangeRateResponseBase.left.success &&
            isLeft(exchangeRateResponseTarget) &&
            exchangeRateResponseTarget.left.success
        ) {
            return {
                currency: baseCurrency,
                targetCurrency,
                // rate = (targetExchangeRateFromEUR / baseExchangeRateFromEUR)
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
            targetCurrency: 'Invalid',
            rate: -1,
        };
    }
}
