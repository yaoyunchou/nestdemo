import { User } from 'src/user/user.entity';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Menus } from 'src/menus/menu.entity';
import { ListResponse } from 'src/interfaces/response.interface';

export const getEntities = (path: string) => {
  // /users ->User , /logs -> Logs, /roles -> Roles, /menus -> Menus, /auth -> 'Auth'
  const map = {
    '/users': User,
    '/logs': Logs,
    '/roles': Roles,
    '/menus': Menus,
    '/auth': 'Auth',
  };

  for (let i = 0; i < Object.keys(map).length; i++) {
    const key = Object.keys(map)[i];
    if (path.startsWith(key)) {
      return map[key];
    }
  }
};


export const responseWarp = <T>(data: T, code: number = 0, message: string ="数据获取成功！") => {
  return new Promise<BaseResponse<T>>((resolve, reject) => {
    resolve({
      data,
      code,
      message,
    });
  });
}