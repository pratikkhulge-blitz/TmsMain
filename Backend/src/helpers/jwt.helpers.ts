import config from '../constants/constants';
import jwt, { JsonWebTokenError, TokenExpiredError, VerifyOptions } from 'jsonwebtoken';

export interface TokenData {
  exp: number;
  data: any; 
}

class TokenManager {
  private jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  public signToken(params: any): string {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        data: params,
      },
      this.jwtSecret
    );
  }

  public verifyToken(token: string): [boolean, string, TokenData] {
    try {
      const data: TokenData = jwt.verify(token, this.jwtSecret) as TokenData;
      return [true, 'Login Success', data];
    } catch (error:any) {
      let err: string;
      switch (error.name) {
        case 'TokenExpiredError':
          err = 'Token Expired';
          break;
        default:
          err = (error as JsonWebTokenError).name;
      }
      return [false, err, { exp: 0, data: null }];
    }
  }
}

const tokenManager = new TokenManager(config.JWT_SECRET);

export default tokenManager;
