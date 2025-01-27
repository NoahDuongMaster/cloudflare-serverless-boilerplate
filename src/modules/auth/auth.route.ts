import { API_ROUTES } from '@/configurations/routes.configuration';
import {
  API_TAGS,
  HTTP_METHOD,
  HTTP_STATUS,
  ZGenericResponse,
} from '@/constants/api.constant';
import { createRoute, z } from '@hono/zod-openapi';

import { ZPostLoginBody, ZPostLoginResponse } from './auth.schema';

export const postLoginRoute = createRoute({
  tags: [API_TAGS.AUTH],
  method: HTTP_METHOD.post,
  path: API_ROUTES.V1.AUTH.LOGIN,
  middleware: [],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ZPostLoginBody.default({
            username: '',
            code: '',
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    [HTTP_STATUS.OK]: {
      description: 'Success',
      content: {
        'application/json': {
          schema: ZGenericResponse(ZPostLoginResponse, HTTP_STATUS.OK),
        },
      },
    },
    [HTTP_STATUS.BAD_REQUEST]: {
      content: {
        'application/json': {
          schema: ZGenericResponse(z.null(), HTTP_STATUS.BAD_REQUEST),
        },
      },
      description: 'Bad Request',
    },
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: ZGenericResponse(z.null(), HTTP_STATUS.INTERNAL_SERVER_ERROR),
        },
      },
      description: 'Internal Server Error',
    },
  },
});

export const postRefreshTokenRoute = createRoute({
  tags: [API_TAGS.AUTH],
  method: HTTP_METHOD.post,
  path: API_ROUTES.V1.AUTH.REFRESH_TOKEN,
  middleware: [],
  security: [],
  request: {},
  responses: {
    [HTTP_STATUS.OK]: {
      description: 'Success',
      content: {
        'application/json': {
          schema: ZGenericResponse(ZPostLoginResponse, HTTP_STATUS.OK),
        },
      },
    },
    [HTTP_STATUS.BAD_REQUEST]: {
      content: {
        'application/json': {
          schema: ZGenericResponse(z.null(), HTTP_STATUS.BAD_REQUEST),
        },
      },
      description: 'Bad Request',
    },
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: ZGenericResponse(z.null(), HTTP_STATUS.INTERNAL_SERVER_ERROR),
        },
      },
      description: 'Internal Server Error',
    },
  },
});
