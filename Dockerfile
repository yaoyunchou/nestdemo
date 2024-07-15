# build stage
FROM node:18 as build-stage

LABEL maintainer=brian@toimc.com

# 创建 app 目录
WORKDIR /app

# 使用.dockerignore文件
COPY . ./

# 使用Yarn安装 app 依赖
# 如果你需要构建生产环境下的代码，请使用：
# --prod参数
RUN yarn install 

RUN npm run build

# production stage
FROM node:18 as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY package.json .

RUN yarn install 

EXPOSE 3001

# 运行程序的脚本或者命令
CMD ["npm", "run", "start:prod"]