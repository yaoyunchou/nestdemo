import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  Post,
  // HttpException,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';

// export function TypeOrmDecorator() {
//   return UseFilters(new TypeormFilter());
// }

@Controller('auth')
@ApiTags('auth')
// @TypeOrmDecorator()
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRedis() private readonly redis: any,
  ) {}

  @Get()
  @ApiOperation({ summary: '认证服务测试接口', operationId: 'getHello' })
  @ApiResponse({ status: 200, description: '服务正常' })
  getHello(): string {
    return 'Hello World!';
  }

  @Public()
  @Post('/signin')
  @ApiOperation({ summary: '用户登录', operationId: 'signin'})
  @ApiBody({ type: SigninUserDto })
  @ApiResponse({ status: 200, description: '登录成功', schema: {
    properties: {
      access_token: { type: 'string', description: '访问令牌' }
    }
  }})
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    const token = await this.authService.signin(username, password);
    // 设置token
    await this.redis.set(username, token);
    return {
      access_token: token,
    };
  }

  @Public()
  @Post('/signup')
  @ApiOperation({ summary: '用户注册', operationId: 'signup'  })
  @ApiBody({ type: SigninUserDto })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '注册失败' })
  // @UseInterceptors(SerializeInterceptor)
  async signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不能为空', 400);
    // }
    // // 正则 -> todo
    // if (typeof username !== 'string' || typeof password !== 'string') {
    //   throw new HttpException('用户名或密码格式不正确', 400);
    // }
    // if (
    //   !(typeof username == 'string' && username.length >= 6) ||
    //   !(typeof password === 'string' && password.length >= 6)
    // ) {
    //   throw new HttpException('用户名密码必须长度超过6', 400);
    // }
    return this.authService.signup(username, password);
  }
}
