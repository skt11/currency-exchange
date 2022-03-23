import 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';

describe('Currency exchange e2e test', () => {
    const request = supertest(`http://localhost:${process.env.PORT || 4000}/`);

    it('User should be able to login and fetch data for india', (done) => {
        request
            .post('login')
            .send({ query: 'mutation{login(id:"1234"){token}}' })
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.login).to.be.not.undefined;
                expect(res.body.data.login.token).to.be.not.undefined;
                expect(res.body.data.login.token).to.not.equal('');

                request
                    .get('api')
                    .send({
                        query: `
            {
                countryDetails(name: "india", targetCurrency:"SEK"){
                  fullName
                  population
                  currencyExchangeRates{
                      currency
                      rate
                      targetCurrency
                  }
                }
              }`,
                    })
                    .set({
                        Authorization: `Bearer ${res.body.data.login.token}`,
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.data.countryDetails).to.be.not
                            .undefined;
                        expect(res.body.data.countryDetails.length).to.equal(1);
                        expect(
                            res.body.data.countryDetails[0].fullName
                        ).to.equal('Republic of India');
                        expect(
                            res.body.data.countryDetails[0]
                                .currencyExchangeRates[0].currency
                        ).to.equal('INR');
                        expect(
                            res.body.data.countryDetails[0]
                                .currencyExchangeRates[0].targetCurrency
                        ).to.equal('SEK');
                        done(err);
                    });
            });
    });
});
