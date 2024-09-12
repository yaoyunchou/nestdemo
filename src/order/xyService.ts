/**
 * product_status
integer 
<int32>
商品状态
必需
枚举值：-1 : 已删除21 : 待发布22 : 销售中23 : 已售罄31 : 手动下架33 : 售出下架36 : 自动下架

枚举值:
-1
21
22
23
31
33
36
默认值:
0
示例值:
21
 */

// 导入crypto-js库
import _ from 'lodash';
import  { XyShopService }  from 'src/shop/shop.service';
import { Injectable } from '@nestjs/common';
const  CryptoJS = require('crypto-js');
const request = require('request');



var DOMAIN = 'https://open.goofish.pro'; // 正式环境域名


// 请求参数
let obj = {
  page_no: 1,
  page_size: 10,
  title: '【清仓包邮】正版二手 普通心理学(第5版） 彭聃龄 北京师范',
};

// 枚举值：-1 : 已删除21 : 待发布22 : 销售中23 : 已售罄31 : 手动下架33 : 售出下架36 : 自动下架
const statusEum = {
  '-1': '已删除',
  21: '待发布',
  22: '销售中',
  23: '已售罄',
  31: '手动下架',
  33: '售出下架',
  36: '自动下架',
};

// 生成签名函数
// export function genSign(timestamp, jsonStr) {
//   // 使用MD5加密生成签名，结果以16进制字符串形式输出
//   let bodyMd5 = CryptoJS.MD5(jsonStr).toString();
//   return CryptoJS.MD5(
//     appKey + ',' + bodyMd5 + ',' + timestamp + ',' + appSecret,
//   ).toString();
// }




@Injectable()
export class XYAPIService {
	constructor(private readonly xyShopService: XyShopService) {
	}
	genSign(timestamp, jsonStr, appKey, appSecret) {
		// 使用MD5加密生成签名，结果以16进制字符串形式输出
		let bodyMd5 = CryptoJS.MD5(jsonStr).toString();
		return CryptoJS.MD5(
		  appKey + ',' + bodyMd5 + ',' + timestamp + ',' + appSecret,
		).toString();
	} 
	async xyRequest<T>(path, body, method = 'POST'): Promise<BaseResponse<T>> {
		try {
			 // 请求体中必有shopName  通过shopName获取对应的appKey和appSecret
			 const { shopName } = body;
			 // 通过shopName获取对应的appKey和appSecret
			 const {appKey , appSecret} = await this.xyShopService.findOneQuery({shopName: '蓝小飞鱼'});
			 // 获取到对应的信息再往下走
			 if(appKey && appSecret) {
				const timestamp = Math.floor(Date.now() / 1000); // 发起请求时的时间戳（秒）
				// json格式化
				let jsonStr = JSON.stringify(body);
			   //  const { appKey, appSecret } = getShopInfo(shopName);
				// 生成签名
				let sign = this.genSign(timestamp, jsonStr,appKey, appSecret );
			  
				console.log(' -- xyRequest--sign--', sign);	
				// 请求地址
				let url = `${DOMAIN}${path}?appid=${appKey}&timestamp=${timestamp}&sign=${sign}`;
				const options = {
				  url: url,
				  method,
				  headers: {
					'Content-Type': 'application/json; charset=utf-8',
				  },
				  body: jsonStr,
				};
				return new Promise((resolve, reject) => {
			      request(options, function (error, response, body) {
			   	 if (!error && response.statusCode === 200) {
			   	   // 处理成功响应
			   	   const responseData:BaseResponse<T> = JSON.parse(body);
			   	   if (responseData.code === 0) {
			   		 	resolve(responseData);
			   	   } else {
			   		 resolve(responseData);
			   	   }
			   	 } else {
			   	   reject(error);
			   	   // 处理错误响应
			   	   console.log('xyRequest:', response);
			   	 }
			      });
				});
			 }
			 
			 // 获取整数时间戳
			
		} catch (error) {
			console.log('xyRequest:', error);
		}
	 
	};
}