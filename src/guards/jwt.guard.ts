import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private configService: ConfigService,
    @InjectRedis() private readonly redis: any,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否是公开路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果是公开路由，直接放行
    if (isPublic) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

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
        const expiration = this.configService.get(ConfigEnum.JWT_EXPIRATION) || 3600;
        await this.redis.set(
          username,
          token,
          'EX',
          expiration
        );
      }

      if (!payload || !username) {
        throw new UnauthorizedException();
      }

      const parentCanActivate = (await super.canActivate(context)) as boolean;
      return parentCanActivate;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}