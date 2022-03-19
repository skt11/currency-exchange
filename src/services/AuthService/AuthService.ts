import { Either, left, right } from 'fp-ts/lib/Either';
import jwt from 'jsonwebtoken';
import {
    AuthenticationError,
    IAuthenticator,
    JWTData,
    TokenCreationError,
} from './types';

export class AuthService implements IAuthenticator {
    private _JWT_SECRET: string;

    constructor(JWT_SECRET: string) {
        this._JWT_SECRET = JWT_SECRET;
    }

    authenticateToken(token: string): Either<JWTData, AuthenticationError> {
        return left({ userId: '1' });
    }

    createToken(data: JWTData): Either<string, TokenCreationError> {
        return left(jwt.sign(data, this._JWT_SECRET));
    }
}
