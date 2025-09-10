import { z } from 'zod';

const id = z.coerce.number().positive().int();

export const updateUserSchema = z
  .object({
    username: z.string().min(1).optional(),
    password: z.string().min(6).optional(),
  })
  .strict();

export const deleteUserSchema = z
  .object({
    id,
  })
  .strict();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type DeleteUserDto = z.infer<typeof deleteUserSchema>;
