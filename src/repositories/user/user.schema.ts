import { user } from '@/repositories/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const UserSchema = createInsertSchema(user);

export const ZUserCreateDto = UserSchema.pick({
  id: true,
  full_name: true,
  role: true,
});

export const ZUserCreateManyDto = z.array(ZUserCreateDto);

export type TUserCreateDto = z.infer<typeof ZUserCreateDto>;
export type TUserCreateManyDto = z.infer<typeof ZUserCreateManyDto>;

export const ZUserUpdateDto = UserSchema.omit({
  created_at: true,
  updated_at: true,
  deleted_at: true,
  id: true,
  role: true,
}).partial();

export type TUserUpdateDto = z.infer<typeof ZUserUpdateDto>;
