import { Injectable, ConflictException } from '@nestjs/common';
import { UserDto } from 'src/utils/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(userDto: UserDto) {
    const userWithSameLogin = await this.findByLogin(userDto.login);
    if (userWithSameLogin)
      throw new RpcException(new ConflictException('Login already in use'));
    const createdUser = this.userRepository.create(userDto);
    return JSON.stringify(await this.userRepository.save(createdUser));
  }

  async findByLogin(login: string) {
    return await this.userRepository.findOneBy({ login });
  }

  async login(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.REFRESH_EXPIRE_TIME,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async validateUser(user: UserDto) {
    const requiredUser = await this.findByLogin(user.login);
    if (requiredUser) {
      return JSON.stringify(requiredUser);
    }
    return null;
  }

  async refresh(payload: any) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.SECRET_EXPIRE_TIME,
    });
    return { accessToken };
  }
}
