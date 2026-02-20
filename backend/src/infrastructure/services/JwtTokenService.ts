import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/interfaces/ITokenService';

export class JwtTokenService implements ITokenService {
  constructor(private secret: string) {}

  generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret) as TokenPayload;
    return { userId: decoded.userId, email: decoded.email };
  }
}
