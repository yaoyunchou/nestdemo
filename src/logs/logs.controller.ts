/*
 * @Author: yaoyc yaoyunchou@bananain.com
 * @Date: 2024-05-29 11:59:26
 * @LastEditors: 筑梦者 303630573@qq.com
 * @LastEditTime: 2024-11-06 21:04:20
 * @FilePath: \nestjs-lesson\src\logs\logs.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request 
  // UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Serialize } from 'src/decorators/serialize.decorator';
import { CaslGuard } from 'src/guards/casl.guard';
import { Can, CheckPolices } from '../decorators/casl.decorator';
import { Logs } from './logs.entity';
import { Action } from 'src/enum/action.enum';
import { LogsService } from './logs.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateLogsDto } from './dto/create.dto';

class   LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  name: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard, CaslGuard)
@CheckPolices((ability) => ability.can(Action.Read, Logs))
@Can(Action.Read, Logs)
// UserInterceptor(new SerializationInterceptor(DTO))
export class LogsController {
  constructor(private readonly logsService: LogsService,
    private readonly userService: UserService) {}
  @Get()
  @Can(Action.Read, Logs)
  async getTest(@Request() req:any) {

    const user = (await this.userService.find(req.user.username)) as User;
    console.log('query' , req?.user, user);

    // 根据用户找到对应的日志
    return  this.logsService.findAll({
      userId: user.id
    })
  }

  @Post()
  @Can(Action.Create, Logs)
  @Serialize(PublicLogsDto)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  async postTest(@Request() req: any, @Body() dto: CreateLogsDto) {
    const user = (await this.userService.find(req.user.username)) as User;
    dto.user = user;
    dto.path = '/logs'
    this.logsService.create(dto);
    return dto;
  }
}
