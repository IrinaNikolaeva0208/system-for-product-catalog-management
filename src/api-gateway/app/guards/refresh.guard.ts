import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {}
