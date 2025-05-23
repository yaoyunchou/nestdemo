import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { XyBookService } from './xyBook.service';
import { CreateXyBookDto } from './dto/create-xyBook.dto';
import { UpdateXyBookDto } from './dto/update-xyBook.dto';
import { QueryXyBookDto } from './dto/query-xyBook.dto';
import { XyBook } from './entities/xyBook.entity';
import { QueryXyOneBookDto } from './dto/query-xyOneBook.dto';

/**
 * 闲鱼书籍控制器
 * 提供闲鱼书籍相关的RESTful API接口
 */
@ApiTags('闲鱼书籍')
@Controller('xyBook')
export class XyBookController {
  private readonly logger = new Logger(XyBookController.name);

  constructor(private readonly xyBookService: XyBookService) {}

  /**
   * 创建新的闲鱼书籍
   * @param createXyBookDto 创建书籍的DTO对象
   * @returns 新创建的书籍实体
   */
  @Post()
  @ApiOperation({ summary: '创建新的闲鱼书籍' })
  @ApiBody({ type: CreateXyBookDto })
  @ApiResponse({ status: 201, description: '闲鱼书籍创建成功', type: XyBook })
  async create(@Body() createXyBookDto: CreateXyBookDto): Promise<BaseResponse<XyBook>> {
    this.logger.log(`创建书籍: ${JSON.stringify(createXyBookDto)}`);
    try {
      const data = await this.xyBookService.create(createXyBookDto);
      this.logger.log(`书籍创建成功: ${data._id}`);
      return {
        code: 200,
        message: '创建成功',
        data
      };
    } catch (error) {
      this.logger.error(`书籍创建失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取闲鱼书籍列表
   * 支持搜索、筛选、分页和排序
   * @param query 查询参数对象
   * @returns 包含书籍列表和总数的对象
   */
  @Get()
  @ApiOperation({ summary: '获取闲鱼书籍列表' })
  @ApiQuery({ name: 'search', required: false, description: '搜索关键词（标题或ISBN）' })
  @ApiQuery({ name: 'product_status', required: false, description: '产品状态筛选' })
  @ApiQuery({ name: 'shopID', required: false, description: '店铺ID筛选' })
  @ApiQuery({ name: 'exposure', required: false, description: '曝光状态筛选' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '每页数量' })
  @ApiQuery({ name: 'sortBy', required: false, description: '排序字段' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: '排序方向' })
  @ApiResponse({ status: 200, description: '返回闲鱼书籍列表', type: [XyBook] })
  async findAll(@Query() query: QueryXyBookDto): Promise<BaseResponse<XyBook>> {
    this.logger.log(`查询书籍列表: ${JSON.stringify(query)}`);
    try {
      const { items, total } = await this.xyBookService.findAll(query);
      this.logger.log(`查询成功，共 ${total} 条记录`);
      return {
        code: 200,
        message: '查询成功',
        data: {
          list: items,
          total,
          page: query.page,
          pageSize: query.pageSize
        }
      };
    } catch (error) {
      this.logger.error(`查询失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取单个闲鱼书籍详情
   * @param id 书籍ID
   * @returns 书籍实体
   */
  @Get(':id')
  @ApiOperation({ summary: '获取单个闲鱼书籍详情' })
  @ApiResponse({ status: 200, description: '返回闲鱼书籍详情', type: XyBook })
  @ApiResponse({ status: 200, description: '闲鱼书籍不存在' })
  async findOne(@Param('id') id: string): Promise<BaseResponse<XyBook>> {
    this.logger.log(`查询书籍详情: ${id}`);
    try {
      const data = await this.xyBookService.findOne(id);
      if(!data){
        this.logger.warn(`书籍不存在: ${id}`);
        return {
          code: 200,
          msg: `闲鱼书籍ID ${id} 不存在`,
          data: null
        }
      }
      this.logger.log(`查询成功: ${id}`);
      return {
        code: 200,
        msg: '查询成功',
        data
      };
    } catch (error) {
      this.logger.error(`查询失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 更新闲鱼书籍信息
   * @param id 书籍ID
   * @param updateXyBookDto 更新的书籍信息
   * @returns 更新后的书籍实体
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新闲鱼书籍信息' })
  @ApiBody({ type: UpdateXyBookDto })
  @ApiResponse({ status: 200, description: '闲鱼书籍更新成功', type: XyBook })
  @ApiResponse({ status: 404, description: '闲鱼书籍不存在' })
  async update(
    @Param('id') id: string,
    @Body() updateXyBookDto: UpdateXyBookDto
  ): Promise<BaseResponse<XyBook>> {
    this.logger.log(`更新书籍: ${id}, 数据: ${JSON.stringify(updateXyBookDto)}`);
    try {
      const data = await this.xyBookService.update(id, updateXyBookDto);
      this.logger.log(`更新成功: ${id}`);
      return {
        code: 200,
        message: '更新成功',
        data
      };
    } catch (error) {
      this.logger.error(`更新失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除闲鱼书籍
   * @param id 书籍ID
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除闲鱼书籍' })
  @ApiResponse({ status: 200, description: '闲鱼书籍删除成功' })
  @ApiResponse({ status: 404, description: '闲鱼书籍不存在' })
  async remove(@Param('id') id: string): Promise<BaseResponse<null>> {
    this.logger.log(`删除书籍: ${id}`);
    try {
      await this.xyBookService.remove(id);
      this.logger.log(`删除成功: ${id}`);
      return {
        code: 200,
        message: '删除成功',
        data: null
      };
    } catch (error) {
      this.logger.error(`删除失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 根据其他数据的相关参数，获取对应的闲鱼书籍
   * @param query 查询参数对象
   * @returns 包含书籍列表和总数的对象    
   */
  @Get('/book/getByOtherData')
  @ApiOperation({ summary: '根据其他数据的相关参数，获取对应的闲鱼书籍' })
  @ApiQuery({ name: 'search', required: false, description: '搜索关键词（标题或内容）' })
  @ApiQuery({ name: 'title', required: false, description: '标题' })
  @ApiQuery({ name: 'product_id', required: false, description: ' ' })
  @ApiQuery({ name: 'shopName', required: false, description: '店铺名称' })
  async getByOtherData(@Query() query: QueryXyOneBookDto): Promise<BaseResponse<XyBook>> {
    this.logger.log(`根据其他数据查询书籍: ${JSON.stringify(query)}`);
    try {
      const data = await this.xyBookService.getByOtherData(query);
      this.logger.log(`查询成功: ${data ? data._id : '无结果'}`);
      return {
        code: 200,
        message: '查询成功',
        data
      };
    } catch (error) {
      this.logger.error(`查询失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 处理数据
   */
  @Get('/fix/book')
  async fixBookData(){
    this.logger.log('开始处理重复数据');
    try {
      const data = await this.xyBookService.handleDuplicateData();
      this.logger.log(`处理完成: ${JSON.stringify(data)}`);
      return {
        code: 200,
        msg: 'ok'
      };
    } catch (error) {
      this.logger.error(`处理失败: ${error.message}`);
      throw error;
    }
  }
} 
