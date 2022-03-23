### Running on local

1. Clone the repository in local
2. Run - `npm install`
3. Create `.env.dev` file in the project root with the following variables:
    > export JWT_SECRET="Super Secret String"\
    > export RESTCOUNTRIES_BASE_URL="https://restcountries.com/v3.1" \
    > export FIXER_API_KEY= \
    > export FIXER_BASE_URL="http://data.fixer.io/api"\
    > export PORT=4000
4. Run `npm run start:dev` to run the development server. It will start on port 4000.

### Running E2E test:

1. Run `npm run start:dev` to run the development server. It will start on port 4000.
2. Run `npm run test:e2e`.

### Endpoints and queries

EP: `/login`

Query:

```
mutation{
    //Any string as id would work
    login(id: "1234"){
        token
    }
}
```

EP: `/api`

Header:

```
Authoriaztion: Bearer {token from /login}
```

Query:

```
{
  countryDetails(name:"india", targetCurrency:"SEK"){
    fullName
    population
    currencyExchangeRates{
      currency
      targetCurrency
      rate
    }
  }
}
```

EP: `/api-open`

Open api without auth, to test with the graphiql interface.

Query:

```
{
  countryDetails(name:"india", targetCurrency:"SEK"){
    fullName
    population
    currencyExchangeRates{
      currency
      targetCurrency
      rate
    }
  }
}
```

### Rate limiting:

`/api` and `/api-open` are rate limited by IP address. Default settings are 30 requests per minute per IP.

Can be updated with adding `RATE_LIMIT_WINDOW` (in ms) and `RATE_MAX_LIMIT` as env variables
