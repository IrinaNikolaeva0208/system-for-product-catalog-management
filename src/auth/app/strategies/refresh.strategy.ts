import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { env } from 'src/utils/env';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET_REFRESH_KEY,
      passReqToCallback: true,
    });
  }

  validate(req: Request) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    if (!refreshToken) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = {
        id: payload.id,
        login: payload.login,
      };
      return user;
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
