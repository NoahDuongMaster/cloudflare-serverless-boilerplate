import { z } from 'zod';

export const ZGenericResponse = <T>(schema: z.ZodType<T>, status: number) =>
  z.object({
    statusCode: z
      .number()
      .min(100)
      .max(599)
      .openapi({ description: 'HTTP status code', default: status }),
    data: schema,
    errors: z
      .array(
        z.object({
          code: z.string().openapi({ description: 'Error code' }),
          message: z.string().openapi({ description: 'Error message' }),
          field: z.string().optional().openapi({ description: 'Field name' }),
        }),
      )
      .optional()
      .openapi({ description: 'Error message' }),
    message: z.string().optional().openapi({ description: 'Message' }),
    pagination: z
      .object({
        page: z.number().openapi({ description: 'Current page' }),
        limit: z.number().openapi({ description: 'Limit per page' }),
        total: z.number().openapi({ description: 'Total pages' }),
      })
      .optional()
      .openapi({ description: 'Pagination' }),
  });

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
