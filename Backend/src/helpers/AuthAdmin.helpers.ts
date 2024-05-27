import { Request, Response } from 'express';
import tokenManager,{TokenData } from './jwt.helpers';
import Admin from '../models/admin.models';

interface AuthorizationResult {
  authorized: boolean;
  message?: string;
}

class AdminAuthorizer {
  public async authorizeAdmin(req: Request, res: Response): Promise<AuthorizationResult> {
    const bearerToken: string | undefined = req.headers.authorization;

    if (!bearerToken) {
      return { authorized: false, message: 'Unauthorized: Please Login First (Token is missing)' };
    }

    const tokenParts: string[] = bearerToken.split(' ');
    const token: string = tokenParts[1];

    const [isTokenValid, message, tokenData]: [boolean, string | undefined, TokenData] = tokenManager.verifyToken(token);
    if (!isTokenValid) {
      return { authorized: false, message: 'Unauthorized: Invalid token' };
    }

    const { email, role }: { email: string; role: string } = tokenData.data;

    try {
      const admin: any | null = await Admin.findOne({ email });
      if (!admin) {
        return { authorized: false, message: 'Unauthorized: admin does not exist' };
      }

      if (role !== 'admin') {
        return { authorized: false, message: 'Only admins can perform this action' };
      }

      return { authorized: true };
    } catch (error) {
      console.error('Error checking admin existence:', error);
      return { authorized: false, message: 'Internal server error' };
    }
  }
}

export {AdminAuthorizer};
