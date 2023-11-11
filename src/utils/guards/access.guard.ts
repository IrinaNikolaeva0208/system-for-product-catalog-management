import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql/dist';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AccessGuard extends AuthGuard('access') {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
