import { TEnvironments } from '@/configurations/env.configuration';
import * as schema from '@/repositories/schema';
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';

export type TD1Service = DrizzleD1Database<typeof schema>;

export class D1Service {
  private static drizzle: TD1Service;

  private constructor() {}

  public static connect(env: TEnvironments): TD1Service {
    if (!D1Service.drizzle) {
      D1Service.drizzle = drizzle(env.DATABASE, {
        schema: schema,
      });
    }
    return D1Service.drizzle;
  }
}
