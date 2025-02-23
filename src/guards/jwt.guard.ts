import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import { InjectRedis } from '@nestjs-modules/ioredis';

export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private configService: ConfigService,
    @InjectRedis() private readonly redis: any,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // custom logic can go here
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    // const cacheToken = this.redis.get(token);
    if (token === 'null') {
      throw new UnauthorizedException();
    }
    const payload = await verify(
      token,
      this.configService.get(ConfigEnum.SECRET),
    );
    const username = payload['username'];
    const tokenCache = username ? await this.redis.get(username) : null;
    // 如果tokenCache 没有缓存到redis, 则新增
    if (!tokenCache) {
      // 设置token并添加过期时间（与JWT过期时间一致）
      const expiration = this.configService.get(ConfigEnum.JWT_EXPIRATION) || 3600; // 默认1小时
      await this.redis.set(
        username,
        token,
        'EX',
        expiration
      );
    }

    if (!payload || !username ) {
      throw new UnauthorizedException();
    }

    const parentCanActivate = (await super.canActivate(context)) as boolean; // this is necessary due to possibly returning `boolean | Promise<boolean> | Observable<boolean>
    // custom logic goes here too
    return parentCanActivate;
  }
}

// 装饰器
// @JwtGuard()
