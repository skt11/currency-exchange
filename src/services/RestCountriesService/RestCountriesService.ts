import { ExternalService, LooseObject } from '../../globalTypes';
import { IRestCountries, RestCountriesServiceError } from './types';
import axios from 'axios';
import { Either, left, right } from 'fp-ts/lib/Either';

export class RestCountriesService
    extends ExternalService
    implements IRestCountries
{
    constructor(BASE_URL: string) {
        super(BASE_URL);
    }

    async getCountryDetailsByName(
        name: string
    ): Promise<Either<LooseObject, RestCountriesServiceError>> {
        try {
            const res = await axios.get(this._BASE_URL + '/name/' + name);
            return left(res.data);
        } catch (e) {
            return right('Failed to fetch country data.');
        }
    }
}
