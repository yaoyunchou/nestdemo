/**
 * 1. 对接飞书， 获取飞书用户信息
 * 2. 获取飞书多维表格的数据, 对数据进行处理
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// 定义接口
interface SortItem {
  field_name: string;
  desc?: boolean;
}

interface FilterCondition {
  field_name: string;
  operator: string;
  value: string[];
}

interface FilterConfig {
  conjunction: 'and' | 'or';
  conditions: FilterCondition[];
}

interface TableQueryParams {
  view_id?: string;
  field_names?: string[];
  sort?: SortItem[];
  filter?: FilterConfig;
  automatic_fields?: boolean;
  page_size?: number;
  page_token?: string;
}

@Injectable()
export class FeiShuService {
  private readonly APP_ID: string;
  private readonly APP_SECRET: string;
  private accessToken: string;
  private readonly baseUrl = 'https://open.feishu.cn/open-apis';

  constructor(private configService: ConfigService) {
    this.APP_ID = this.configService.get('FS_APP_ID');
    this.APP_SECRET = this.configService.get('FS_APP_SECRET');
  }

  // 获取访问令牌
  private async getAccessToken() {
    // if (this.accessToken) return this.accessToken;

    try {
      const response = await axios.post(
        `${this.baseUrl}/auth/v3/tenant_access_token/internal`,
        {
          app_id: this.APP_ID,
          app_secret: this.APP_SECRET,
        }
      );

      this.accessToken = response.data.tenant_access_token;
      return this.accessToken;
    } catch (error) {
      throw new Error('获取飞书访问令牌失败');
    }
  }

  // 创建请求头
  private async getHeaders() {
    const token = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // 获取多维表格记录
  async getTableRecords(appToken: string, tableId: string, page_size:number, data?:any) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(
        `${this.baseUrl}/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
        {
          headers,
          params:{
            page_size:page_size ||20
          },
          data
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('获取多维表格记录失败');
    }
  }

  // 创建记录
  async createTableRecord(appToken: string, tableId: string, fields: any) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${this.baseUrl}/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
        { fields },
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error('创建多维表格记录失败');
    }
  }

  // 更新记录
  async updateTableRecord(appToken: string, tableId: string, recordId: string, fields: any) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.put(
        `${this.baseUrl}/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
        { fields },
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error('更新多维表格记录失败');
    }
  }

  // 删除记录
  async deleteTableRecord(appToken: string, tableId: string, recordId: string) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.delete(
        `${this.baseUrl}/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error('删除多维表格记录失败');
    }
  }

  // 批量创建记录
  async batchCreateTableRecords(appToken: string, tableId: string, records: any[]) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${this.baseUrl}/bitable/v1/apps/${appToken}/tables/${tableId}/records/batch_create`,
        { records },
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error('批量创建多维表格记录失败');
    }
  }

  // 搜索记录
  async searchTableRecords(appToken: string, tableId: string, searchParams: {
    filter?: Object;
    sort?: Object;
    view_id?: string;
    page_size?: number;
    page_token?: string;
  }) {
    try {
      const headers = await this.getHeaders();
      var config = {
        method: 'POST',
        url: `${this.baseUrl}/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`,
        headers,
        params: {
            page_size: searchParams?.page_size || 20
        },
        data:{
            filter: searchParams.filter || {},
            sort: searchParams?.sort || [],
            // view_id: searchParams?.view_id

        }
     };
     
     const response = await axios(config as any)
      
      return response.data;
    } catch (error) {
      throw new Error('搜索多维表格记录失败');
    }
  }

  // 新增查询方法
  async queryTableRecords(appToken: string, tableId: string, params: TableQueryParams) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${this.baseUrl}/bitable/v1/apps/${appToken}/tables/${tableId}/records/query`,
        params,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error('查询多维表格记录失败');
    }
  }

  // 辅助方法：构建查询参数
  buildQueryParams({
    viewId,
    fieldNames = [],
    sortConfig = [],
    filterConfig = null,
    pageSize = 100,
    pageToken = '',
    automaticFields = false
  }: {
    viewId?: string;
    fieldNames?: string[];
    sortConfig?: { fieldName: string; isDesc?: boolean }[];
    filterConfig?: {
      conditions: { fieldName: string; operator: string; value: string[] }[];
      conjunction?: 'and' | 'or';
    };
    pageSize?: number;
    pageToken?: string;
    automaticFields?: boolean;
  }): TableQueryParams {
    const params: TableQueryParams = {
      automatic_fields: automaticFields
    };

    // 添加视图ID
    if (viewId) {
      params.view_id = viewId;
    }

    // 添加字段名
    if (fieldNames.length > 0) {
      params.field_names = fieldNames;
    }

    // 添加排序
    if (sortConfig.length > 0) {
      params.sort = sortConfig.map(item => ({
        field_name: item.fieldName,
        desc: item.isDesc
      }));
    }

    // 添加过滤条件
    if (filterConfig && filterConfig.conditions.length > 0) {
      params.filter = {
        conjunction: filterConfig.conjunction || 'and',
        conditions: filterConfig.conditions.map(condition => ({
          field_name: condition.fieldName,
          operator: condition.operator,
          value: condition.value
        }))
      };
    }

    // 添加分页
    if (pageSize) {
      params.page_size = pageSize;
    }
    if (pageToken) {
      params.page_token = pageToken;
    }

    return params;
  }
}

