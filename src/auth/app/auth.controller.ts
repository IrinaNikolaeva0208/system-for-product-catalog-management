import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateAuthDto } from 'src/utils/dto/user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('createAuth')
  create(@Payload() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @MessagePattern('findAllAuth')
  findAll() {
    return this.authService.findAll();
  }

  @MessagePattern('findOneAuth')
  findOne(@Payload() id: number) {
    return this.authService.findOne(id);
  }

  @MessagePattern('removeAuth')
  remove(@Payload() id: number) {
    return this.authService.remove(id);
  }
}
