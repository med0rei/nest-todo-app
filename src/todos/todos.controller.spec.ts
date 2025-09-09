import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from './todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './schemas/todo.schema';

describe('TodosController', () => {
  let controller: TodosController;
  let fakeTodosService: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    fakeTodosService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [{ provide: TodosService, useValue: fakeTodosService }],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("getTodos should call service's findAll method once with no args and return an array of todos", async () => {
    const expectedTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
    ] as const;
    fakeTodosService.findAll.mockResolvedValue(expectedTodos);

    const result: Todo[] = await controller.getTodos();

    expect(fakeTodosService.findAll).toHaveBeenCalledTimes(1);
    expect(fakeTodosService.findAll).toHaveBeenCalledWith();
    expect(result).toEqual(expectedTodos);
  });

  it("getTodo should call service's findOne method once with the correct id", async () => {
    const todoId = 1;

    await controller.getTodo({ id: todoId });

    expect(fakeTodosService.findOne).toHaveBeenCalledTimes(1);
    expect(fakeTodosService.findOne).toHaveBeenCalledWith(todoId);
  });

  it('getTodo should return a todo', async () => {
    const todoId = 1;
    const expectedTodo = { id: todoId, title: 'Todo 1', completed: false };
    fakeTodosService.findOne.mockResolvedValue(expectedTodo);

    const result: Todo | null = await controller.getTodo({ id: todoId });

    expect(result).toEqual(expectedTodo);
  });

  it("createTodo should call service's create method once with the correct dto", async () => {
    const createTodoDto: CreateTodoDto = {
      title: 'New Todo',
      description: 'New Todo Desc',
      completed: false,
    };
    const createdTodo: Todo = { id: 1, ...createTodoDto };
    fakeTodosService.create.mockResolvedValue(createdTodo);

    const result = await controller.createTodo(createTodoDto);

    expect(fakeTodosService.create).toHaveBeenCalledTimes(1);
    expect(fakeTodosService.create).toHaveBeenCalledWith(createTodoDto);
    expect(result).toEqual(createdTodo);
  });

  it("updateTodo should call service's update method once with the correct id and dto", async () => {
    const todoId = 1;
    const updateTodoDto = {
      title: 'Updated Todo',
      description: 'Updated Desc',
      completed: true,
    };
    const updatedTodo: Todo = { id: todoId, ...updateTodoDto };
    fakeTodosService.update.mockResolvedValue(updatedTodo);

    const result = await controller.updateTodo(todoId, updateTodoDto);

    expect(fakeTodosService.update).toHaveBeenCalledTimes(1);
    expect(fakeTodosService.update).toHaveBeenCalledWith(todoId, updateTodoDto);
    expect(result).toEqual(updatedTodo);
  });

  it("deleteTodo should call service's delete method once with the correct id", async () => {
    const todoId = 1;

    await controller.deleteTodo({ id: todoId });

    expect(fakeTodosService.delete).toHaveBeenCalledTimes(1);
    expect(fakeTodosService.delete).toHaveBeenCalledWith(todoId);
  });
});
