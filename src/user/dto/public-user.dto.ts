import { Exclude, Expose } from 'class-transformer';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { Profile } from '../profile.entity';

export class PublicUserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Exclude() // 这里是什么意思？ 
  password: string;

  // typescript -> 数据库 关联关系 Mapping
  @Expose()
  logs: Logs[];

  @Expose()
  roles: Roles[];

  @Expose()
  profile: Profile;

  // @AfterInsert()
  // afterInsert() {
  //   console.log('afterInsert', this.id, this.username);
  // }

  // @AfterRemove()
  // afterRemove() {
  //   console.log('afterRemove');
  // }
}
