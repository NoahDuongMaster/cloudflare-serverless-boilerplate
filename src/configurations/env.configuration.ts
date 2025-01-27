import { z } from 'zod';

export const ZEnvironmentMode = z.enum(['dev', 'prod', 'local']);

export type TEnvironments = {
  DATABASE: D1Database;
  BUCKET: R2Bucket;
  KV: KVNamespace;
  JWT_SECRET: string;
  DNU_CODE: string;
};

export type TVariables = {
  PROJECT_NAME: string;
  CORS_ORIGIN: string;
  R2_BUCKET_URL: string;
  MODE: z.infer<typeof ZEnvironmentMode>;
};

export type TBindings = {
  Bindings: TEnvironments;
  Variables: TVariables;
};
