import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUserRepository: {
    findOneBy: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    fakeUserRepository = {
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: fakeUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("findOne should call repository's findOneBy method once with the correct username", async () => {
    const username = 'testuser';

    await service.findOne(username);

    expect(fakeUserRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(fakeUserRepository.findOneBy).toHaveBeenCalledWith({ username });
  });

  it("create should call repository's create and save methods once with the correct CreateUserDto", async () => {
    const createUserDto: CreateUserDto = {
      username: 'newuser',
      password: 'password123',
    };
    const createdUser: User = {
      id: 1,
      username: 'newuser',
      password_hash: 'hashedpassword',
    };
    fakeUserRepository.findOneBy.mockResolvedValue(null);
    fakeUserRepository.create.mockReturnValue(createdUser);
    fakeUserRepository.save.mockResolvedValue(createdUser);

    const result = await service.create(createUserDto);

    expect(fakeUserRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(fakeUserRepository.findOneBy).toHaveBeenCalledWith({
      username: createUserDto.username,
    });
    expect(fakeUserRepository.create).toHaveBeenCalledTimes(1);
    expect(fakeUserRepository.create).toHaveBeenCalledWith({
      username: createUserDto.username,
      password_hash: expect.any(String),
    });
    expect(fakeUserRepository.save).toHaveBeenCalledTimes(1);
    expect(fakeUserRepository.save).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual(createdUser);
  });
});
