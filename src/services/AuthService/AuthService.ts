import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import jwt from 'jsonwebtoken';
import {
    AuthenticationError,
    IAuthenticator,
    JWTData,
    TokenCreationError,
    TokenData,
} from './types';

export class AuthService implements IAuthenticator {
    private _JWT_SECRET: string;
    private _tokenMap: TokenData;

    constructor(JWT_SECRET: string) {
        this._JWT_SECRET = JWT_SECRET;
        this._tokenMap = {};
    }

    authenticateToken(token: string): Either<JWTData, AuthenticationError> {
        try {
            const data = jwt.verify(token, this._JWT_SECRET) as JWTData;
            if (this._tokenMap[data.userId].tokenList.includes(token)) {
                return left({ userId: data.userId });
            }
            return right('Failed to authenticate token.');
        } catch (e) {
            return right('Failed to authenticate token.');
        }
    }

    createToken(data: JWTData): Either<string, TokenCreationError> {
        try {
            const token = jwt.sign(data, this._JWT_SECRET);
            if (this._tokenMap[data.userId]) {
                this._tokenMap[data.userId].tokenList.push(token);
            } else {
                this._tokenMap[data.userId] = { tokenList: [token] };
            }
            return left(token);
        } catch (e) {
            return right('Failed to create token.');
        }
    }

    getAuthMiddleWare(): Function {
        return (req: any, res: any, next: any) => {
            const bearerToken = req.headers['authorization'];

            console.log(bearerToken);

            if (!!!bearerToken) {
                return res.sendStatus(403);
            }

            const jwtToken = bearerToken?.split(' ')[1];
            const authResponse = this.authenticateToken(
                jwtToken ? jwtToken : ''
            );

            console.log(authResponse);

            if (isLeft(authResponse)) {
                const userData = authResponse.left;
                req.user = userData;
                return next();
            }

            return res.sendStatus(403);
        };
    }
}
