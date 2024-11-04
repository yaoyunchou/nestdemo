/*
 * @Author: yaoyc yaoyunchou@bananain.com
 * @Date: 2024-05-29 11:59:26
 * @LastEditors: yaoyc yaoyunchou@bananain.com
 * @LastEditTime: 2024-11-04 16:02:15
 * @FilePath: \nestjs-lesson\src\logs\logs.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  name: string;

  @Column()
  appName: string;

  @Column()
  appId: string;

  @Column("text")
  msg: string;

  @Column("text",  {nullable: true })
  result: string;

  @CreateDateColumn() // 创建时间
    createdAt: Date;


  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn()
  user: User;
}
