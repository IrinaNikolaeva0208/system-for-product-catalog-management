import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { UserDto } from 'src/utils/dto/user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('user.signup')
  create(@Payload() userDto: UserDto) {
    return this.authService.create(userDto);
  }

  @MessagePattern('user.login')
  login(@Payload() userDto: UserDto) {
    return this.authService.login(userDto);
  }

  @MessagePattern('user.refresh')
  refresh(@Payload() userDto: UserDto) {
    return this.authService.refresh(userDto);
  }

  @MessagePattern('user.validate')
  validate(@Payload() userDto: UserDto) {
    return this.authService.validateUser(userDto);
  }
}
