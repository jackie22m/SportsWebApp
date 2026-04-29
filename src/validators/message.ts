import { z } from 'zod';

export const CreateMessageSchema = z.object({
  text: z.string().min(1),
  receiverId: z.string(),
});

export type CreateMessageBody = z.infer<typeof CreateMessageSchema>;
