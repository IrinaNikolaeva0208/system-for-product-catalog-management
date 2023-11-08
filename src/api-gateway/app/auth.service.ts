import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { UserDto } from 'src/utils/dto/user.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  signUp(user: UserDto) {
    return this.authClient
      .send('user.signup', user)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  login(user: any) {
    return this.authClient
      .send('user.login', user)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  refresh(user: any) {
    return this.authClient
      .send('user.refresh', user)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  async validateUser(login: string, password: string) {
    return await new Promise<any>((resolve) =>
      this.authClient
        .send('user.validate', { login, password })
        .subscribe((data) => {
          resolve(data);
        }),
    );
  }

  onModuleInit() {
    const authTopics = [
      'user.signup',
      'user.login',
      'user.refresh',
      'user.validate',
    ];
    authTopics.forEach((topic) => this.authClient.subscribeToResponseOf(topic));
  }
}
