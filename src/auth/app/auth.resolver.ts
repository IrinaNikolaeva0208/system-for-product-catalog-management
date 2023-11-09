import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserInput } from './dto/user.input';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { RefreshGuard } from './guards/refresh.guard';
import { ResponseMessage } from './entities/message.entity';
import { LocalGuard } from './guards/local.guard';
import { CurrentUser } from './decorators/user.decorator';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  signUp(@Args('userInput') userInput: UserInput) {
    return this.authService.create(userInput);
  }

  @Mutation(() => ResponseMessage)
  @UseGuards(LocalGuard)
  async login(
    @Args('userInput') userInput: UserInput,
    @Context('res') res: any,
  ) {
    const tokens = await this.authService.login(userInput);
    res.cookie('access', tokens.accessToken);
    res.cookie('refresh', tokens.refreshToken);
    return { message: 'Successfully logged in' };
  }

  @Mutation(() => ResponseMessage)
  @UseGuards(RefreshGuard)
  async refresh(@CurrentUser() user: User, @Context('res') res: any) {
    const { accessToken } = await this.authService.refresh(user);
    res.cookie('access', accessToken);
    return { message: 'Successfully refreshed' };
  }

  // @MessagePattern('user.validate')
  // validate(@Payload() userDto: UserDto) {
  //   return this.authService.validateUser(userDto);
  // }
}
