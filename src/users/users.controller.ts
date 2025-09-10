import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import type { RequestWith } from '../types/request-with.d';
import type { DeleteUserDto, UpdateUserDto } from './schemas/user.schema';
import { updateUserSchema, deleteUserSchema } from './schemas/user.schema';
import { UserDto } from '../users/dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

type RequestWithUser = RequestWith<{ user: UserDto }>;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req: RequestWithUser): Promise<UserDto> {
    const user: User | null = await this.usersService.findOneById(
      req.user.userId,
    );
    if (!user) {
      throw new Error('User not found');
    }
    return { userId: user.id, username: user.username };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const result = this.usersService.update(req.user.userId, updateUserDto);
    return {
      userId: (await result).id,
      username: (await result).username,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(deleteUserSchema))
  async delete(
    @Request() req: RequestWithUser,
    @Param() deleteUserDto: DeleteUserDto,
  ): Promise<void> {
    return this.usersService.delete(req.user.userId);
  }
}
