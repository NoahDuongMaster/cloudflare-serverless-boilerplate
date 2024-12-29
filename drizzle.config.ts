import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/repositories/schema.ts',
  driver: 'd1-http',
  out: './migrations',
  dbCredentials: {
    accountId: '',
    databaseId: '',
    token: '',
  },
});
