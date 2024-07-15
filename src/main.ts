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
  const config2 = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config2);
  SwaggerModule.setup('api', app, document);
  const port =
    typeof config['APP_PORT'] === 'string'
      ? parseInt(config['APP_PORT'])
      : 3000;
  await app.listen(port);
  await app.init();
}
bootstrap();
