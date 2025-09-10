import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import type { RequestWith } from '../types/request-with.d';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import type { SignupDto } from './schemas/auth.schema';
import { loginSchema, signupSchema } from './schemas/auth.schema';

type RequestWithUser = RequestWith<{ user: UserDto }>;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req: RequestWithUser,
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupSchema))
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signup(signupDto.username, signupDto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: RequestWithUser): UserDto {
    return req.user;
  }
}
