import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, ResponseMessage } from 'src/utils/entities';
import { UserInput } from './dto/user.input';
import {
  Resolver,
  Mutation,
  Args,
  Context,
  ResolveReference,
} from '@nestjs/graphql/dist';
import { RefreshGuard, LocalGuard } from './guards';
import { Role } from 'src/utils/enums';
import { Roles, Public, CurrentUser } from 'src/utils/decorators';
import { AccessGuard, AuthenticatedGuard, RolesGuard } from 'src/utils/guards';

@UseGuards(AccessGuard, AuthenticatedGuard)
@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => User)
  signUp(@Args('userInput') userInput: UserInput) {
    return this.authService.create(userInput);
  }

  @Public()
  @Mutation(() => ResponseMessage)
  @UseGuards(LocalGuard)
  async login(
    @Args('userInput') userInput: UserInput,
    @Context('res') res: any,
  ) {
    const tokens = await this.authService.login(userInput);
    res.cookie('access', tokens.accessToken, { httpOnly: true });
    res.cookie('refresh', tokens.refreshToken, { httpOnly: true });
    return { message: 'Successfully logged in' };
  }

  @Public()
  @Mutation(() => ResponseMessage)
  @UseGuards(RefreshGuard)
  async refresh(@CurrentUser() user: User, @Context('res') res: any) {
    const { accessToken } = await this.authService.refresh(user);
    res.cookie('access', accessToken);
    return { message: 'Successfully refreshed' };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Mutation(() => User)
  async changeUserRole(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('role') role: Role,
  ) {
    return await this.authService.changeRoleById(id, role);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return await this.authService.findById(reference.id);
  }
}
