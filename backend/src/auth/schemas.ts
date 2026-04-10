import { z } from 'zod';

export const LoginInfo = z.object({
  userId: z.string().min(1, 'User ID is required'),
});