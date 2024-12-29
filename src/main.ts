import { API_TAGS } from '@/constants/api.constant';
import authController from '@/modules/auth/auth.controller';
import {
  TBindings,
  TEnvironments,
  TVariables,
  ZEnvironmentMode,
} from '@/schemas/common.schema';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { except } from 'hono/combine';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { jwt } from 'hono/jwt';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { z } from 'zod';

import { ZAccessToken } from './configurations/jwt.configuration';

const app = new OpenAPIHono<TBindings>().basePath('/api');
app.openAPIRegistry.registerComponent('securitySchemes', 'JWT', {
  type: 'http',
  scheme: 'bearer',
});

app.use('*', async (c, next) => {
  const env = c.env as TVariables & TEnvironments;
  const corsMiddlewareHandler = cors({
    origin: env?.CORS_ORIGIN?.split(','),
    credentials: true,
  });
  return corsMiddlewareHandler(c, next);
});

app.use('*', async (c, next) => {
  const env = c.env as TEnvironments & TVariables;
  const mode = env.MODE as z.infer<typeof ZEnvironmentMode>;
  const csrfMiddlewareHandler = csrf({
    origin: env?.CORS_ORIGIN?.split(',') || '*',
  });
  return mode === 'local' ? await next() : csrfMiddlewareHandler(c, next);
});

app.use(
  '*',
  except(
    [
      '/api/v1/docs',
      '/api/v1/openapi',
      `/api/v1/${API_TAGS.AUTH.toLowerCase()}/*`,
    ],
    (c, next) => {
      const jwtMiddleware = jwt({
        secret: c.env.JWT_SECRET,
        cookie: {
          key: ZAccessToken.value,
        },
      });
      return jwtMiddleware(c, next);
    },
  ),
);

app.use('*', requestId());
app.use(secureHeaders());
app.use(trimTrailingSlash());
app.use(prettyJSON());

// AUTH
app.route(
  '/v1' + `/${API_TAGS.AUTH.toLowerCase()}`,
  authController.postLogin(),
);

app.route(
  '/v1' + `/${API_TAGS.AUTH.toLowerCase()}`,
  authController.postRefreshToken(),
);

// DOCS - SWAGGER
app.get('/v1/docs', swaggerUI({ url: '/api/v1/openapi' }));
app.doc31('/v1/openapi', (c) => {
  const env = c.env as TEnvironments & TVariables;
  const mode = env.MODE as z.infer<typeof ZEnvironmentMode>;

  if (mode !== 'local') {
    return null as never;
  }

  return {
    openapi: '3.1.0',
    info: { title: env.PROJECT_NAME, version: '1' },
    servers: [],
  };
});

export default app;
