import { ZRoles } from '@/repositories/schema';
import { z } from 'zod';

export const ZPostLoginBody = z.object({
  username: z.string().min(1),
  code: z.string().min(1),
});

export const ZPostLoginResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const ZJWTPayload = z.object({
  sub: z.string(),
  full_name: z.string().nullable(),
  role: ZRoles,
  exp: z.number(),
});

export type IPostLoginBody = z.infer<typeof ZPostLoginBody>;
export type IPostLoginResponse = z.infer<typeof ZPostLoginResponse>;
export type TJWTPayload = z.infer<typeof ZJWTPayload>;
