import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    try {
      if (await argon2.verify(user.password_hash, password)) {
        // password matched
        const payload = { sub: user.id, username: user.username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        // password did not match
        throw new UnauthorizedException();
      }
    } catch (err) {
      // internal failure
      throw new UnauthorizedException();
    }
  }

  async signUp(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.create({
      username,
      password,
    });
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
