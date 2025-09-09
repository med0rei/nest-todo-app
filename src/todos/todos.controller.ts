import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import type {
  CreateTodoDto,
  DeleteTodoDto,
  GetTodoDto,
  UpdateTodoDto,
} from './schemas/todo.schema';
import {
  createTodoSchema,
  deleteTodoSchema,
  getTodoSchema,
  updateTodoSchema,
} from './schemas/todo.schema';
import { Todo } from './todo.entity';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getTodos(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(getTodoSchema))
  getTodo(@Param() getTodoDto: GetTodoDto): Promise<Todo | null> {
    return this.todosService.findOne(getTodoDto.id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTodoSchema))
  createTodo(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Put(':id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateTodoSchema)) updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @UsePipes(new ZodValidationPipe(deleteTodoSchema))
  deleteTodo(@Param() deleteTodoDto: DeleteTodoDto): Promise<void> {
    return this.todosService.delete(deleteTodoDto.id);
  }
}
