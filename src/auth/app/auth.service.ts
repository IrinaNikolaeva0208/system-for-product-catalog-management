import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/utils/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInput } from './dto/user.input';
import { Role } from 'src/utils/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(userDto: UserInput) {
    const userWithSameLogin = await this.findByLogin(userDto.login);
    if (userWithSameLogin) throw new ConflictException('Login already in use');
    const createdUser = this.userRepository.create({
      ...userDto,
      role: Role.User,
      password: await bcrypt.hash(
        userDto.password,
        this.configService.get<number>('CRYPT_SALT'),
      ),
    });
    return await this.userRepository.save(createdUser);
  }

  async findByLogin(login: string) {
    return await this.userRepository.findOneBy({ login });
  }

  async login(user: UserInput) {
    const { password, ...payload } = (await this.findByLogin(
      user.login,
    )) as User;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>('SECRET_EXPIRE_TIME'),
      }),
      this.jwtService.signAsync(payload),
    ]);
    return { accessToken, refreshToken };
  }

  async validateUser(user: UserInput) {
    const requiredUser = await this.findByLogin(user.login);
    if (
      requiredUser &&
      (await bcrypt.compare(user.password, requiredUser.password))
    ) {
      return requiredUser;
    }
    return null;
  }

  async refresh(payload: any) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('SECRET_EXPIRE_TIME'),
    });
    return { accessToken };
  }

  async changeRoleById(id: string, role: Role) {
    const requiredUser = await this.findById(id);
    if (!requiredUser) throw new NotFoundException('User not found');
    requiredUser.role = role;
    return await this.userRepository.save(requiredUser);
  }

  async findById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }
}
