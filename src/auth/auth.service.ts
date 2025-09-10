import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDto | null> {
    const user: User | null = await this.usersService.findOne(username);

    console.log('User fetched:', user);
    if (!user) {
      console.log('User not found');
      return null;
    }

    try {
      if (await argon2.verify(user.password_hash, password)) {
        // password matched
        return { userId: user.id, username: user.username };
      } else {
        // password did not match
        console.log('Invalid password');
        return null;
      }
    } catch (err) {
      // internal failure
      return null;
    }
  }

  async login(user: UserDto): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const newUser = await this.usersService.create({
      username,
      password,
    });

    const userDto: UserDto = { userId: newUser.id, username: newUser.username };
    return this.login(userDto);
  }
}
