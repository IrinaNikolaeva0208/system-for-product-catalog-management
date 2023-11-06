import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/utils/dto/user.dto';
import { Request, Response } from 'express';
import { RefreshGuard } from './guards/refresh.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signupUser(@Body() userDto: UserDto) {
    return this.authService.signUp(userDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async signInUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await new Promise<any>((resolve) =>
      this.authService.login(req.user).subscribe((data) => {
        resolve(data);
      }),
    );
    res.cookie('access', tokens.accessToken);
    res.cookie('refresh', tokens.refreshToken);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  refreshAccessToken(@Req() req: Request) {
    return this.authService.refresh(req.user);
  }
}
