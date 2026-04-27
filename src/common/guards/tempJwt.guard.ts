import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TempJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'Unauthorized please sign in or register',
      );
    }
    const decode = this.jwtService.verify(token);

    if (!decode.isTemp) {
      throw new UnauthorizedException('Invalid token type');
    }
    req.user = decode;
    return true;
  }
}
