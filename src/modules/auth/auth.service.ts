import { ERROR_MESSAGES } from '@/constants/api.constant';
import {
  IPostLoginBody,
  IPostLoginResponse,
  TJWTPayload,
} from '@/modules/auth/auth.schema';
import UserRepository from '@/repositories/user/user.repository';
import { TEnvironments, TVariables } from '@/schemas/common.schema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { sign, verify } from 'hono/jwt';

dayjs.extend(utc);

class AuthService {
  private readonly JWT_SECRET: string;
  private readonly DNU_CODE: string;
  private readonly userRepository: UserRepository;
  constructor(env: TEnvironments & TVariables) {
    this.JWT_SECRET = env.JWT_SECRET;
    this.DNU_CODE = env.DNU_CODE;
    this.userRepository = new UserRepository(env);
  }
  public async postLogin(data: IPostLoginBody): Promise<IPostLoginResponse> {
    const user = await this.userRepository.findById(data.username);

    if (!user) {
      throw new Error(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (data.code.trim().toLowerCase() !== this.DNU_CODE.toLowerCase()) {
      throw new Error(ERROR_MESSAGES.AUTH.INVALID_CODE);
    }

    const accessTokenPayload: TJWTPayload = {
      sub: user.id,
      full_name: user.full_name,
      role: user.role,
      exp: dayjs.utc().add(12, 'hours').unix(),
    };

    const refreshTokenPayload: TJWTPayload = {
      sub: user.id,
      full_name: user.full_name,
      role: user.role,
      exp: dayjs.utc().add(1, 'weeks').unix(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      sign(accessTokenPayload, this.JWT_SECRET),
      sign(refreshTokenPayload, this.JWT_SECRET),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  public async postRefreshToken(
    refreshTk: string,
  ): Promise<IPostLoginResponse> {
    const decodedPayload = (await verify(
      refreshTk,
      this.JWT_SECRET,
    )) as TJWTPayload;

    if (decodedPayload.exp < dayjs.utc().unix()) {
      throw new Error(ERROR_MESSAGES.AUTH.EXPIRED_REFRESH_TOKEN);
    }

    const user = await this.userRepository.findById(decodedPayload.sub);

    if (!user) {
      throw new Error(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const accessTokenPayload: TJWTPayload = {
      sub: user.id,
      full_name: user.full_name,
      role: user.role,
      exp: dayjs.utc().add(5, 'minutes').unix(),
    };

    const refreshTokenPayload: TJWTPayload = {
      sub: user.id,
      full_name: user.full_name,
      role: user.role,
      exp: dayjs.utc().add(1, 'weeks').unix(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      sign(accessTokenPayload, this.JWT_SECRET),
      sign(refreshTokenPayload, this.JWT_SECRET),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

export default AuthService;
