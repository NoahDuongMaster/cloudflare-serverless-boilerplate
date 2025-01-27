import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { text } from 'drizzle-orm/sqlite-core';

dayjs.extend(utc);

export const timestamps = {
  updated_at: text().default(dayjs().utc().toISOString()).notNull(),
  created_at: text().default(dayjs().utc().toISOString()).notNull(),
  deleted_at: text(),
};
