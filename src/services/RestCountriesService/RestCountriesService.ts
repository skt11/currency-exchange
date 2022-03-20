import { ExternalService, LooseObject } from '../../globalTypes';
import { IRestCountries } from './types';
import axios from 'axios';

export class RestCountriesService
    extends ExternalService
    implements IRestCountries
{
    constructor(BASE_URL: string) {
        super(BASE_URL);
    }

    async getCountryDetailsByName(name: string): Promise<LooseObject> {
        const res = await axios.get(this._BASE_URL + '/name/' + name);
        console.log(res);
        return res;
    }
}
