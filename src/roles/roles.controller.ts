import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('roles')
@Roles(Role.Admin)
@UseGuards(JwtGuard, RoleGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()

  @ApiOperation({ summary: '创建角色', description: '创建一个新角色' , operationId: 'createRole'})
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有角色', description: '获取所有角色列表' , operationId: 'findAllRoles'})
  // @Roles(Role.User)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色详情', description: '获取指定角色的详细信息' , operationId: 'findOneRole'})
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新角色', description: '更新指定角色的信息' , operationId: 'updateRole'})
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色', description: '删除指定角色' , operationId: 'deleteRole'})
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
