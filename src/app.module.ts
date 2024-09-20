import { Global, Logger, LoggerService, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

import { connectionParams } from '../ormconfig';

import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { MenusModule } from './menus/menus.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';

// import { APP_GUARD, } from '@nestjs/core';
// import { AdminGuard } from './guards/admin.guard';
import { ConfigEnum, LogEnum } from './enum/config.enum';
import { PanelAnimationModule } from './panel-animation/panel-animation.module';
import { BookModule } from './book/book.module';
import { ShopModule } from './shop/shop.module';
import { OrderModule } from './order/order.module';
import { BiziModule } from './bizi/bizi.module';

const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DB_PORT: Joi.number().default(3306),
  DB_HOST: Joi.alternatives().try(Joi.string().ip(), Joi.string().domain()),
  DB_TYPE: Joi.string().valid('mysql', 'postgres'),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  LOG_ON: Joi.boolean(),
  LOG_LEVEL: Joi.string(),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath,e
      // https://github.com/nestjs/config/issues/209#issuecomment-625765057
      // load方法需要自己加入验证
      // 解决方法：https://dev.to/rrgt19/ways-to-validate-environment-configuration-in-a-forfeature-config-in-nestjs-2ehp
      load: [
        async() => {
          const values =   dotenv.config({ path: '.env' });
          const newConfig = {
            NODE_ENV: process.env[ConfigEnum.NODE_ENV],
            DB_PORT: process.env[ConfigEnum.DB_PORT],
            DB_HOST: process.env[ConfigEnum.DB_HOST],
            DB_TYPE: process.env[ConfigEnum.DB_TYPE],
            DB_DATABASE: process.env[ConfigEnum.DB_DATABASE],
            DB_USERNAME: process.env[ConfigEnum.DB_USERNAME],
            DB_PASSWORD: process.env[ConfigEnum.DB_PASSWORD],
            DB_SYNC: process.env[ConfigEnum.DB_SYNC],
            LOG_ON:process.env[LogEnum.LOG_ON],
            LOG_LEVEL: process.env[LogEnum.LOG_LEVEL],
          };
          
          const { error } = schema.validate(process.env.NODE_ENV === "production" ? newConfig: values.parsed, {
            // 允许未知的环境变量
            allowUnknown: true,
            // 如果有错误，不要立即停止，而是收集所有错误
            abortEarly: false,
          });
          if (error) {
            throw new Error(
              `Validation failed - Is there an environment variable missing?
              ${error.message}`,
            );
          }

          return process.env.NODE_ENV === "production" ? newConfig: values.parsed
        },
      ],
      validationSchema: schema,
    }),
    // Redis集成
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: LoggerService) => {
        const host = configService.get(ConfigEnum.REDIS_HOST);
        const port = configService.get(ConfigEnum.REDIS_PORT);
        const password = configService.get(ConfigEnum.REDIS_PASSWORD);
        const url = password
          ? `redis://:${password}@${host}:${port}`
          : `redis://:${host}:${port}`;
        return {
          config: {
            url,
            reconnectOnError: (err) => {
              logger.error(`Redis Connection error: ${err}`);
              return true;
            },
          },
        };
      },
      inject: [ConfigService, Logger],
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
    RolesModule,
    AuthModule,
    MenusModule,
    PanelAnimationModule,
    BookModule,
    ShopModule,
    OrderModule,
    BiziModule,
  ],
  controllers: [],
  providers: [
    Logger,
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminGuard,
    // },
  ],
  exports: [Logger],
})
export class AppModule {}
