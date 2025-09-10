import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './schemas/user.schema';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(createUserDto.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const createdUser = this.usersRepository.create({
      username: createUserDto.username,
      password_hash: await argon2.hash(createUserDto.password),
    });
    return this.usersRepository.save(createdUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password) {
      user.password_hash = await argon2.hash(updateUserDto.password);
    }

    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
