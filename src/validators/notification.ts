import { z } from 'zod';

export const CreateNotificationSchema = z.object({
  notifMessage: z.string().min(1),
});

export type CreateNotificationBody = z.infer<typeof CreateNotificationSchema>;
