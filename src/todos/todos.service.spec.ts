import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { CreateTodoDto } from './schemas/todo.schema';
import { Todo } from './todo.entity';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;
  let fakeTodoRepository: {
    find: jest.Mock;
    findOneBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    fakeTodoRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as const;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: getRepositoryToken(Todo), useValue: fakeTodoRepository },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("findAll should call repository's find method once with no args and return an array of todos", async () => {
    const expectedTodos: Todo[] = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
    ] as const;
    fakeTodoRepository.find.mockResolvedValue(expectedTodos);

    const todos = await service.findAll();

    expect(fakeTodoRepository.find).toHaveBeenCalledTimes(1);
    expect(fakeTodoRepository.find).toHaveBeenCalledWith();
    expect(todos).toEqual(expectedTodos);
  });

  it("findOne should call repository's findOneBy method once with the correct id", async () => {
    const todoId = 1;

    await service.findOne(todoId);

    expect(fakeTodoRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(fakeTodoRepository.findOneBy).toHaveBeenCalledWith({ id: todoId });
  });

  it('findOne should return a todo', async () => {
    const expectedTodo: Todo = {
      id: 1,
      title: 'Todo 1',
      completed: false,
    } as const;
    fakeTodoRepository.findOneBy.mockResolvedValue(expectedTodo);

    const todo = await service.findOne(1);

    expect(todo).toEqual(expectedTodo);
  });

  it("create should call repository's create and save methods once with the correct data", async () => {
    const createTodoDto: CreateTodoDto = {
      title: 'New Todo',
      description: 'New Description',
      completed: false,
    } as const;
    const createdTodo: Todo = {
      id: 1,
      ...createTodoDto,
    } as const;
    fakeTodoRepository.create.mockReturnValue(createdTodo);
    fakeTodoRepository.save.mockResolvedValue(createdTodo);

    const todo = await service.create(createTodoDto);

    expect(fakeTodoRepository.create).toHaveBeenCalledTimes(1);
    expect(fakeTodoRepository.create).toHaveBeenCalledWith(createTodoDto);
    expect(fakeTodoRepository.save).toHaveBeenCalledTimes(1);
    expect(fakeTodoRepository.save).toHaveBeenCalledWith(createdTodo);
    expect(todo).toEqual(createdTodo);
  });

  it("update should call repository's save method once with the correct data", async () => {
    const todoId = 1;
    const updateTodoDto = {
      title: 'Updated Todo',
      description: 'Updated Description',
      completed: true,
    };
    const updatedTodo: Todo = {
      id: todoId,
      ...updateTodoDto,
    } as const;
    fakeTodoRepository.save.mockResolvedValue(updatedTodo);

    const todo = await service.update(todoId, updateTodoDto);

    expect(fakeTodoRepository.save).toHaveBeenCalledTimes(1);
    expect(fakeTodoRepository.save).toHaveBeenCalledWith(updatedTodo);
    expect(todo).toEqual(updatedTodo);
  });

  it("delete should call repository's delete method once with the correct id", async () => {
    const todoId = 1;

    await service.delete(todoId);

    expect(fakeTodoRepository.delete).toHaveBeenCalledTimes(1);
    expect(fakeTodoRepository.delete).toHaveBeenCalledWith(todoId);
  });
});
