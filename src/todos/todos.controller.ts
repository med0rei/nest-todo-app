import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('todos')
export class TodosController {
  @Get()
  getTodos(): string {
    return 'This action returns all todos';
  }

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto): string {
    return 'This action creates a new todo';
  }

  @Put()
  updateTodo(@Body() updateTodoDto: UpdateTodoDto): string {
    return 'This action updates a todo';
  }

  @Delete()
  deleteTodo(@Body('id') id: number): string {
    return `This action deletes a todo with id ${id}`;
  }
}
