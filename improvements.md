### Improvements that can be done with more time:

1. Spend more time understanding graphql as this was the first time I have worked on this.
2. Write unit tests and add more robust tests in the server.
3. Introduce a database to store user data (User ID, password or anything relevant).
4. Use password hashing to store user password.
5. Improve JWT security by adding expiry, refresh tokens etc.
6. Cache external api call responses to reduce time consuming tasks and make the overall experience faster.
7. More extensive error handling, more specific and tailored error messages to the end user.
8. Write a custom Rate limiting service instead of relying on an external module. This will give the flexibility to rate limit on any key that we want instead of only IP.
9. Infrastructure improvements like dockerizing the service, adding a ci/cd pipeline. This helps in handling future scaling requirements.
10. Potentially decouple the Authorization service and use that as an identity provider, this could enable us to create a multi purpose SSO service.
