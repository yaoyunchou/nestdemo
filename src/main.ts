// Copyright (c) 2022 toimc<admin@wayearn.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupApp } from './setup';
// import { AllExceptionFilter } from './filters/all-exception.filter';
import { getServerConfig } from '../ormconfig';
import { json } from 'body-parser';
import { TransformInterceptor } from './interceptors/transform.interceptor';


async function bootstrap() {
  const config = getServerConfig();
  

  const app = await NestFactory.create(AppModule, {
    // 关闭整个nestjs日志
    // logger: flag && [],
    // logger: false,
    // 允许跨域
    cors: true,
    // 开启日志
    logger: ['log','error', 'warn'],
  });
  setupApp(app);
  app.use(json({ limit: '50mb' }));
  const config2 = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // 添加全局响应模型
  const options = {
    wrapperSchema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 0 },
        message: { type: 'string', example: 'success' },
        result: { type: 'object' }
      }
    }
  };

  const document = SwaggerModule.createDocument(app, config2, options as any);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha', // 按字母顺序排序标签
      operationsSorter: 'alpha', // 按字母顺序排序操作
      persistAuthorization: true,
    },
  });
  const port =
    typeof config['APP_PORT'] === 'string'
      ? parseInt(config['APP_PORT'])
      : 3000;
  await app.listen(port);
  await app.init();
  console.log(`Server is running on port http://localhost:${port}/api`);
  // 通过nodejs获取ip地址访问
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let ip = '';
  for (const key in networkInterfaces) {
    if (networkInterfaces[key]) {
      for (const item of networkInterfaces[key]) {  
        if (item.family === 'IPv4' && !item.internal) {
          ip = item.address;
        }
      }
    }
  } 

  console.log(`Server is running on port http://${ip}:${port}/api`);

  // 全局应用响应转换拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
}
bootstrap();
