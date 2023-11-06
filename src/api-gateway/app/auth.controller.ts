import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/utils/dto/user.dto';
import { Request } from 'express';
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
  signInUser(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  refreshAccessToken(@Req() req: Request) {
    return this.authService.refresh(req.user);
  }
}
