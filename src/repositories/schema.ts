import { sqliteTable as table } from 'drizzle-orm/sqlite-core';
import * as t from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

import { timestamps } from '../helpers/sqlite.helper';

export const ZRoles = z.enum(['customer', 'admin']);

export const user = table('user', {
  id: t.text().primaryKey(),
  full_name: t.text(),
  role: t
    .text({ enum: ZRoles.options })
    .$type<z.infer<typeof ZRoles>>()
    .notNull()
    .default('customer'),
  ...timestamps,
});
