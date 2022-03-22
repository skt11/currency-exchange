import { AuthService } from '../../services/AuthService/AuthService';
import { isLeft } from 'fp-ts/lib/Either';

export const getLoginResolver = (authService: AuthService) => ({
    Mutation: {
        login: (_: any, { id }: { id: string }) => {
            const tokenRes = authService.createToken({ userId: id });
            if (isLeft(tokenRes)) {
                authService.authenticateToken(tokenRes.left);
                return { token: tokenRes.left };
            }
            throw new Error(tokenRes.right);
        },
    },
    Query: {
        name: () => 'Login',
    },
});
