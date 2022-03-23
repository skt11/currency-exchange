import { Either } from 'fp-ts/lib/Either';

export type JWTData = {
    userId: string;
};

export type AuthenticationError = 'Failed to authenticate token.';
export type TokenCreationError = 'Failed to create token.';

export interface IAuthenticator {
    authenticateToken(token: string): Either<JWTData, AuthenticationError>;
    createToken(data: JWTData): Either<string, TokenCreationError>;
}

export type TokenMap = {
    [userId: string]: {
        tokenList: string[];
    };
};
