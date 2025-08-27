import { Controller, Get, Post } from '@nestjs/common';

@Controller('todos')
export class TodosController {
  @Get()
  getTodos(): string {
    return 'This action returns all todos';
  }

  @Post()
  createTodo(): string {
    return 'This action creates a new todo';
  }
}
