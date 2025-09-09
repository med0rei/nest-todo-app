import { z } from 'zod';

const id = z.coerce.number().positive().int();

export const createTodoSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    completed: z.boolean().default(false),
  })
  .strict();

export const getTodoSchema = z
  .object({
    id,
  })
  .strict();

export const updateTodoSchema = z
  .object({
    title: z.string().min(1), //.optional(),
    description: z.string(), //.optional(),
    completed: z.boolean(), //.optional(),
  })
  .strict();

export const deleteTodoSchema = z
  .object({
    id,
  })
  .strict();

export type CreateTodoDto = z.infer<typeof createTodoSchema>;
export type GetTodoDto = z.infer<typeof getTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
export type DeleteTodoDto = z.infer<typeof deleteTodoSchema>;
