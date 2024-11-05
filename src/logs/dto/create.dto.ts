/*
 * @Author: yaoyc yaoyunchou@bananain.com
 * @Date: 2024-11-04 15:53:05
 * @LastEditors: yaoyc yaoyunchou@bananain.com
 * @LastEditTime: 2024-11-04 16:14:32
 * @FilePath: \nestjs-lesson\src\logs\dto\create-log.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';

export class CreateLogsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsOptional()
  user: User;

  @IsString()
  @IsOptional()
  path: string;

  @IsString()
  @IsOptional()
  appId: string;

  @IsString()
  @IsOptional()
  appName: string;

  @IsString()
  @IsOptional()
  msg: string;

  @IsString()
  @IsOptional()
  result: string;

}
