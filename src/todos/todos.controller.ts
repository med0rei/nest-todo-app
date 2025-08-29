import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getTodos(): Promise<Todo[]> {
    // return 'This action returns all todos';
    return this.todosService.findAll();
  }

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
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
