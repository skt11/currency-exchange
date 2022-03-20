import { LooseObject } from '../../globalTypes';

export interface IRestCountries {
    getCountryDetailsByName(name: string): LooseObject;
}
