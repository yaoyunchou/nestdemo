## 项目介绍

项目基础技术栈是：Nestjs 9.x + TypeORM + MySQL5.7


运行项目之前，请先自行配置本地的数据库环境，并修改项目根目录中的配置文件：`.env`，`.env.development`（开发），`.env.production`（生产）。



推荐使用`node14 LTS`安装依赖：

```
npm i 
```



运行项目：

```
npm run start:dev
```


## cli 命令

#### 生成整个模块
nest generate resource [name]：生成一个新的模块，包括控制器、服务、模块、实体、DTO、接口、枚举、管道、拦截器、守卫、过滤器等。

nest generate module [name]：生成一个新的模块。
nest generate controller [name]：在指定模块中生成一个新的控制器。
nest generate service [name]：在指定模块中生成一个新的服务。
nest generate class [name]：生成一个新的普通类。
nest generate interface [name]：生成一个新的接口。
nest generate enum [name]：生成一个新的枚举类型。
nest generate gateway [name]：生成一个新的网关（用于WebSockets或Microservices）。
nest generate filter [name]：生成一个新的异常过滤器。
nest generate guard [name]：生成一个新的守卫。
nest generate interceptor [name]：生成一个新的拦截器。
nest generate pipe [name]：生成一个新的管道。

## swgger

```nodejs
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@ApiTags('users')  // 给这个控制器打上标签
@Controller('users')
export class UsersController {
  @Post()
  @ApiOperation({ summary: 'Create a new user', description: 'This API creates a new user with the provided information.' })
  @ApiBody({ type: CreateUserDto, description: 'The user creation payload' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createUser(@Body() createUserDto: CreateUserDto): User {
    // 创建用户的逻辑
    const newUser = new User();
    newUser.name = createUserDto.name;
    newUser.email = createUserDto.email;
    return newUser;
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'This API retrieves all users from the system.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved users.', type: [User] })
  getAllUsers(): User[] {
    // 获取所有用户的逻辑
    const users: User[] = [];
    // 假设从数据库获取用户列表
    return users;
  }
}
```
    