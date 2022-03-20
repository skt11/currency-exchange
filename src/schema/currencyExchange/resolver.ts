export const getCurrencyExchangeResolver = () => ({
    Query: {
        countryDetails: (_: any, { name }: { name: string }) => {
            console.log(name);
            return [
                {
                    fullName: name,
                    population: 1000,
                    currencyExchangeRates: [
                        {
                            currency: 'INR',
                            rate: 0.8,
                            targetCurrency: 'USD',
                        },
                    ],
                },
            ];
        },
    },
});
