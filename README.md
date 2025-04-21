## 项目介绍

项目基础技术栈是：Nestjs 9.x + TypeORM + MySQL5.7

运行项目之前，请先自行配置本地的数据库环境，并修改项目根目录中的配置文件：`.env`，`.env.development`（开发），`.env.production`（生产）。

### 模块说明

#### xyBook 模块
闲鱼书籍数据模块，包含以下功能：

- 书籍基本信息管理
- 店铺信息管理
- 数据统计（曝光量、浏览量、想要数）
- 价格和状态管理

数据库表结构：
```sql
CREATE TABLE xy_books (
  _id VARCHAR(255) PRIMARY KEY,
  product_id BIGINT NOT NULL,
  title VARCHAR(255),
  isbn VARCHAR(255),
  book_data JSON,
  content TEXT,
  createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  exposure INT DEFAULT 0,
  views INT DEFAULT 0,
  wants INT DEFAULT 0,
  publish_shop JSON,
  price DECIMAL(10,2),
  product_status INT,
  statusText VARCHAR(255),
  shopName VARCHAR(255),
  shopID VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

初始化数据：
1. 将数据文件 `data.json` 放置在 `src/modles/xyBook/` 目录下
2. 运行迁移命令：
```bash
npm run migration:run
```

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

## API 文档规范 (2024-03-21)

### Swagger 分组规划
基于现有src目录结构，API 将按以下方式分组：
- 用户认证 (Auth)
- 系统配置 (System)
- 文件服务 (Files)
- 基础服务 (Common)
- 闲鱼书籍 (XyBook)

### 开发规范
1. Controller 必须添加 @ApiTags 进行分组
2. 接口必须包含 @ApiOperation 说明
3. 涉及请求体的接口需要使用 @ApiBody
4. 标准响应使用 @ApiResponse

### 目录结构
```
src/
├── controllers/     # 控制器目录
├── services/        # 服务目录
├── entities/        # 实体目录
├── dto/            # 数据传输对象
├── interfaces/     # 接口定义
├── filters/        # 过滤器
├── guards/         # 守卫
├── decorators/     # 装饰器
└── interceptors/   # 拦截器
```

### DTO 规范 (2024-03-21)

#### xyBook 模块 DTOs

1. CreateXyBookDto
- 用于创建新的闲鱼书籍记录
- 包含必填字段：product_id, title, isbn, book_data, content, publish_shop, price, product_status, statusText, shopName, shopID
- 使用 Swagger 装饰器进行 API 文档生成

2. UpdateXyBookDto
- 继承自 CreateXyBookDto
- 使用 PartialType 使所有字段可选
- 用于更新现有书籍记录

3. QueryXyBookDto
- 用于查询和分页
- 支持以下查询参数：
  - search: 按标题或 ISBN 搜索
  - product_status: 按产品状态筛选
  - shopID: 按店铺 ID 筛选
  - exposure: 按曝光状态筛选
  - page: 页码（默认 1）
  - limit: 每页数量（默认 10）
  - sortBy: 排序字段（默认 createAt）
  - sortOrder: 排序方向（默认 desc）

### 实体和服务规范 (2024-03-21)

#### xyBook 模块实体

1. XyBook 实体
- 使用 TypeORM 装饰器定义数据库表结构
- 包含所有必要的字段映射
- 使用 Swagger 装饰器进行 API 文档生成
- 支持自动时间戳（createAt, updateAt）
- 支持 JSON 类型字段（book_data, publish_shop）

#### xyBook 模块服务

1. XyBookService
- 提供完整的 CRUD 操作
- 支持复杂的查询和分页
- 包含以下方法：
  - create: 创建新书籍记录
  - findAll: 查询书籍列表（支持搜索、筛选、分页）
  - findOne: 获取单个书籍详情
  - update: 更新书籍信息
  - remove: 删除书籍记录
- 使用 QueryBuilder 构建复杂查询
- 包含适当的错误处理

### 控制器规范 (2024-03-21)

#### xyBook 模块控制器

1. XyBookController
- 提供完整的 RESTful API 接口
- 使用 Swagger 装饰器进行 API 文档生成
- 包含以下端点：
  - POST /xyBook: 创建新书籍
  - GET /xyBook: 查询书籍列表（支持搜索、筛选、分页）
  - GET /xyBook/:id: 获取单个书籍详情
  - PATCH /xyBook/:id: 更新书籍信息
  - DELETE /xyBook/:id: 删除书籍记录
- 每个端点都包含：
  - 适当的 HTTP 方法装饰器
  - Swagger 操作说明
  - 请求/响应类型定义
  - 错误处理

## 最新更新 (2024-03-21)

### 时间戳处理优化
- 修改了 `xyBook` 实体中的时间戳字段定义，从 `bigint` 类型改为 MySQL 原生的 `timestamp` 类型
- 更新了 `createAt` 和 `updateAt` 字段的默认值和自动更新设置
- 优化了导入服务中的时间戳处理逻辑，确保与新的实体定义兼容

### 数据库表结构更新
```sql
CREATE TABLE xy_books (
  _id VARCHAR(255) PRIMARY KEY,
  product_id BIGINT NOT NULL,
  title VARCHAR(255),
  isbn VARCHAR(255),
  book_data JSON,
  content TEXT,
  createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  exposure INT DEFAULT 0,
  views INT DEFAULT 0,
  wants INT DEFAULT 0,
  publish_shop JSON,
  price DECIMAL(10,2),
  product_status INT,
  statusText VARCHAR(255),
  shopName VARCHAR(255),
  shopID VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 导入服务优化
- 重构了 `XyBookImportService` 的导入逻辑
- 添加了更详细的错误处理和统计信息
- 优化了时间戳的转换处理
- 改进了 ID 生成机制