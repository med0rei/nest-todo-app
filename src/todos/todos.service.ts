import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';

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

  async delete(id: number): Promise<void> {
    await this.todosRepository.delete(id);
  }
}
