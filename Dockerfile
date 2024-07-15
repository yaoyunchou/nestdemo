# 使用官方的 Node.js 作为基础镜像
FROM node:14

# 创建并设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm i

# 复制项目文件到工作目录
COPY . .

# 编译 NestJS 项目
RUN npm run build

# 暴露应用运行的端口
EXPOSE 3001

# 定义应用的启动命令
CMD ["npm", "run", "start:dev"]
