import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Inject,
  LoggerService,
  Body,
  Param,
  Query,
  UseFilters,
  UnauthorizedException,
  ParseIntPipe,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Serialize } from 'src/decorators/serialize.decorator';
import { PublicUserDto } from './dto/public-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import _ from 'lodash';
import { responseWarp } from 'src/utils/common';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
@UseFilters(new TypeormFilter())
// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtGuard)
@ApiTags('user')
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // this.logger.log('UserController init');
  }

  @Get('/profile')
  @ApiOperation({ summary: '获取用户详情', operationId: 'getUserProfile' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUserProfile(@Req() req: Request & { user: { userId: number, username: string } }) {
    return await this.userService.findProfile(req.user.userId);
  }

  // todo
  // logs Modules
  @Get('/logs')
  @ApiOperation({ summary: '获取用户日志', operationId: 'getUserLogs' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUserLogs() {
    return await this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  @ApiOperation({ summary: '获取用户日志组', operationId: 'getLogsByGroup' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getLogsByGroup() {
    return await this.userService.findLogsByGroup(2);
  }

  @Get()
  // 非常重要的知识点
  // 1. 装饰器的执行顺序，方法的装饰器如果有多个，则是从下往上执行
  // @UseGuards(AdminGuard)
  // @UseGuards(AuthGuard('jwt'))
  // 2. 如果使用UseGuard传递多个守卫，则从前往后执行，如果前面的Guard没有通过，则后面的Guard不会执行
  @Serialize(PublicUserDto)
  @ApiOperation({ summary: '获取用户列表', operationId: 'getUsers' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUsers(@Query() query: getUserDto): Promise<BaseResponse<ListResponse<User>>> {
    const { list, total } = await this.userService.findAll(query);
    return  responseWarp({
      list,
      total,
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 10
    });
  }

  @Post()
  @ApiOperation({ summary: '创建用户', operationId: 'addUser' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async addUser(@Body(CreateUserPipe) dto: CreateUserDto) {
    return await this.userService.create(dto as User);
  }

  @Get('/:id')
  @ApiOperation({ summary: '获取用户详情', operationId: 'getUser' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUser(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '更新用户', operationId: 'updateUser' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async updateUser(
    @Body() dto: any,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    // @Headers('Authorization') headers: any,
  ) {
    // console.log(
    //   '🚀 ~ file: user.controller.ts ~ line 76 ~ UserController ~ headers',
    //   headers,
    // );
    if (id === parseInt(req.user?.userId)) {
      console.log(123);
      // 说明是同一个用户在修改
      // todo
      // 权限1：判断用户是否是自己
      // 权限2：判断用户是否有更新user的权限
      // 返回数据：不能包含敏感的password等信息
      return await this.userService.update(id, dto as User);
    } else {
      throw new UnauthorizedException();
    }
  }

  // 1.controller名 vs service名 vs repository名应该怎么取
  // 2.typeorm里面delete与remove的区别
  @Delete('/:id') // RESTfull Method
  @ApiOperation({ summary: '删除用户', operationId: 'removeUser' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeUser(@Param('id') id: number): Promise<any> {
    // 权限：判断用户是否有更新user的权限
    return await this.userService.remove(id);
  }
  // 如果是管理员可以帮助其他账号重置密码为123456
  @Patch('/:id/resetPassword')
  @Serialize(PublicUserDto)
  @ApiOperation({ summary: '重置用户密码', operationId: 'resetUserPassword' })
  @ApiResponse({ status: 200, description: '重置成功' })
  async resetUserPassword(@Param('id') id: number, @Req() req) {
    // 权限：判断用户是否有更新user的权限
    console.log(req.user);
    const user = await this.userService.findOne(req.user.userId)
    if(user.roles.some(role => role.name === 'admin')) {
      return await this.userService.resetPassword(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('change-password')
  @Serialize(PublicUserDto)
  @ApiOperation({ summary: '修改密码', operationId: 'changePassword' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: '密码修改成功' })
  @ApiResponse({ status: 400, description: '密码验证失败' })
  @ApiResponse({ status: 401, description: '原密码错误' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request & { user: { userId: number } }
  ) {
    const { oldPassword, newPassword } = changePasswordDto;
    

    // 验证新密码不能与旧密码相同
    if (oldPassword === newPassword) {
      throw new BadRequestException('新密码不能与原密码相同');
    }

    const userId = req.user.userId;
    const user = await this.userService.findOne(userId);

    // 验证原密码是否正确
    const isValidPassword = await this.userService.validatePassword(oldPassword, user.password);
    if (!isValidPassword) {
      return responseWarp({
        code:10001,
        data: null,
        message: '原密码错误'
      });
    }

    // 更新密码
    const result =   await this.userService.updatePassword(userId, newPassword);
    
    return {
      code: 0,
      data: result,
      message: '密码修改成功'
    };
  }
}
