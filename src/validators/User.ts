import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type CreateUserBody = z.infer<typeof CreateUserSchema>;
