import { TBindings } from '@/configurations/env.configuration';
import { ZRefreshToken } from '@/configurations/jwt.configuration';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/api.constant';
import { customLogger } from '@/helpers/common.helper';
import { OpenAPIHono } from '@hono/zod-openapi';
import { Context } from 'hono';
import { getCookie } from 'hono/cookie';

import { postLoginRoute, postRefreshTokenRoute } from './auth.route';
import { ZPostLoginBody } from './auth.schema';
import AuthService from './auth.service';

class AuthController {
  private app: OpenAPIHono<TBindings>;
  constructor() {
    this.app = new OpenAPIHono<TBindings>();
  }

  public postLogin() {
    return this.app.openapi(postLoginRoute, async (c) => {
      customLogger({
        context: c as unknown as Context,
        name: this.postLogin.name,
        type: 'info',
        message: '',
      });
      const authService = new AuthService(c.env);
      const body = await c.req.json();
      const parsedBody = ZPostLoginBody.safeParse(body);

      if (!parsedBody.success) {
        return c.json(
          {
            statusCode: HTTP_STATUS.BAD_REQUEST,
            message: parsedBody.error.name,
            data: null,
          },
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      try {
        const data = await authService.postLogin(parsedBody.data);
        return c.json({ statusCode: HTTP_STATUS.OK, data }, HTTP_STATUS.OK);
      } catch (e) {
        const error = e as Error;

        if (Object.values(ERROR_MESSAGES.AUTH).includes(error.message)) {
          return c.json(
            {
              statusCode: HTTP_STATUS.BAD_REQUEST,
              message: error.message,
              data: null,
            },
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        return c.json(
          {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
            data: null,
          },
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }

  public postRefreshToken() {
    return this.app.openapi(postRefreshTokenRoute, async (c) => {
      const authService = new AuthService(c.env);

      try {
        const refreshToken = getCookie(
          c as unknown as Context,
          ZRefreshToken.value,
        );

        if (!refreshToken) {
          return c.json(
            {
              statusCode: HTTP_STATUS.BAD_REQUEST,
              message: ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN,
              data: null,
            },
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        const data = await authService.postRefreshToken(refreshToken);
        return c.json({ statusCode: HTTP_STATUS.OK, data }, HTTP_STATUS.OK);
      } catch (e) {
        const error = e as Error;

        if (Object.values(ERROR_MESSAGES.AUTH).includes(error.message)) {
          return c.json(
            {
              statusCode: HTTP_STATUS.BAD_REQUEST,
              message: error.message,
              data: null,
            },
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        return c.json(
          {
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
            data: null,
          },
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
}

export default new AuthController();
