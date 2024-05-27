import { Request, Response } from 'express';
import tokenManager, {TokenData } from './jwt.helpers';

interface AuthorizationResult {
  authorized: boolean;
  message?: string;
  organisation?: string;
  email?: string;
}

class UserAuthorizer {
  public async authorizeUser(req: Request, res: Response): Promise<AuthorizationResult> {
    const bearerToken: string | undefined = req.headers.authorization;

    if (!bearerToken) {
      return { authorized: false, message: 'Unauthorized: Please Login First (Token is missing)' };
    }

    const tokenParts: string[] = bearerToken.split(' ');
    const token: string = tokenParts[1];

    const [isTokenValid, message, tokenData]: [boolean, string, TokenData] = tokenManager.verifyToken(token);
    console.log(message);
    if (!isTokenValid) {
      return { authorized: false, message: 'Unauthorized: Invalid token' };
    }

    const { role, organisation, email }: { role: string; organisation: string; email: string } = tokenData.data;

    if (role !== 'user') {
      return { authorized: false, message: 'Only users can perform this action' };
    }

    return { authorized: true, organisation, email };
  }
}

export {UserAuthorizer};
