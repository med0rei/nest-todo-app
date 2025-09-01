import { z } from 'zod';

export const loginSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .required();

export type LoginDto = z.infer<typeof loginSchema>;
