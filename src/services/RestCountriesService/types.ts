import { Either } from 'fp-ts/lib/Either';
import { LooseObject } from '../../globalTypes';

export type RestCountriesServiceError = 'Failed to fetch country data.';

export interface IRestCountries {
    getCountryDetailsByName(
        name: string
    ): Promise<Either<LooseObject, RestCountriesServiceError>>;
}
