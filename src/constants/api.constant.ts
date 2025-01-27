import { z } from '@hono/zod-openapi';

export const HTTP_STATUS = {
  // 1xx: Informational
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,

  // 2xx: Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 3xx: Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 4xx: Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,

  // 5xx: Server Error
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const HTTP_METHOD = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch',
} as const;

export const API_TAGS = {
  COMMON: 'Common',
  AUTH: 'Auth',
};

export const ERROR_MESSAGES = {
  AUTH: {
    USER_NOT_FOUND: 'Username or password is incorrect',
    INVALID_CODE: 'Invalid code',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    EXPIRED_REFRESH_TOKEN: 'Refresh token is expired',
  },
};

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
