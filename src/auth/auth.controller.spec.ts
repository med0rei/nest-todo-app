import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: {
    validateUser: jest.Mock;
    login: jest.Mock;
  };

  beforeEach(async () => {
    fakeAuthService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: fakeAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access_token from authService', async () => {
      const mockUser: UserDto = { userId: 1, username: 'test' };
      const token = { access_token: 'jwt-token' };

      fakeAuthService.login.mockResolvedValue(token);

      const result = await controller.login({ user: mockUser });

      expect(fakeAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(token);
    });
  });

  describe('profile', () => {
    it('should return user from request', () => {
      const mockUser: UserDto = { userId: 1, username: 'test' };

      const result = controller.getProfile({ user: mockUser });

      expect(result).toEqual(mockUser);
    });
  });
});
