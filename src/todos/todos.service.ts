import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todosRepository.find();
  }

  findOne(id: number): Promise<Todo | null> {
    return this.todosRepository.findOneBy({ id });
  }

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = this.todosRepository.create({
      title: createTodoDto.title,
      description: createTodoDto.description,
      completed: false,
    });
    return this.todosRepository.save(createdTodo);
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updateTodoDtoWithId = { id, ...updateTodoDto };
    return this.todosRepository.save(updateTodoDtoWithId);
  }

  async delete(id: number): Promise<void> {
    await this.todosRepository.delete(id);
  }
}
