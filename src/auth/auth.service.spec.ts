jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: {
    findOne: jest.Mock;
    create: jest.Mock;
  };
  let fakeJwtService: {
    sign: jest.Mock;
  };

  beforeEach(async () => {
    fakeUsersService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    fakeJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
        { provide: JwtService, useValue: fakeJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    jest.mock('argon2', () => ({
      verify: jest.fn(),
    }));

    it('should return user data without password if credentials are valid', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        password_hash: 'fake-password-hash',
      };
      fakeUsersService.findOne.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password');

      expect(fakeUsersService.findOne).toHaveBeenCalledTimes(1);
      expect(fakeUsersService.findOne).toHaveBeenCalledWith('testuser');
      expect(result).toEqual({
        userId: mockUser.id,
        username: mockUser.username,
      });
    });
  });

  describe('login', () => {
    it('should return user data without password if credentials are valid', async () => {
      const mockUser: UserDto = {
        userId: 1,
        username: 'testuser',
      };
      const fakeJwtToken = 'fake-jwt-token';
      fakeJwtService.sign.mockReturnValue(fakeJwtToken);

      const result = await service.login(mockUser);
      expect(fakeJwtService.sign).toHaveBeenCalledTimes(1);
      expect(fakeJwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.userId,
      });

      expect(result).toEqual({ access_token: fakeJwtToken });
    });
  });
});
