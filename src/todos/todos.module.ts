import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';

@Module({
  controllers: [TodosController],
  providers: [],
  exports: [],
})
export class TodosModule {}
