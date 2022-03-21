import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { LooseObject } from '../../globalTypes';
import { FixerService } from '../FixerService/FixerService';
import { FixerServiceError } from '../FixerService/types';
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
        const countryDetailsResponse =
            await this._restCountriesService.getCountryDetailsByName(
                countryName
            );

        if (isLeft(countryDetailsResponse)) {
            const countryDetailList = countryDetailsResponse.left;

            for (let index in countryDetailList) {
                const exchangeRatePromiseList = countryDetailList[
                    index
                ].currencies
                    .keys()
                    .map((curr: string) =>
                        this._getExchangeRateByEURBase(curr, targetCurrency)
                    );

                const exchangeRatePromiseRes = await Promise.allSettled(
                    exchangeRatePromiseList
                );

                countryDetailList.currencyExchangeRates =
                    exchangeRatePromiseRes.map(
                        (res) => res.status === 'fulfilled' && res.value
                    );
            }

            return left(countryDetailList as CountryDetails[]);
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
                        targetCurrency.toUpperCase()
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
