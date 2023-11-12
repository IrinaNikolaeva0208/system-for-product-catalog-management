import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;
    await super.logIn(gqlReq);
    return result;
  }

  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;
    const {
      userInput: { login, password },
    } = ctx.getArgs();
    gqlReq.body.login = login;
    gqlReq.body.password = password;
    return gqlReq;
  }
}
