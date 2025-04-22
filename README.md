# Truck
The visual interface was developed using Vue and the interaction was optimized. The business logic for processing the Spring Boot service was built. The data collected by the device was obtained through Mqtt. The Gaode Map API was integrated to realize the real-time location query and path planning of the vehicle.


## Development
```bash
# 克隆项目
https://github.com/APIPI0/Truck.git

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

## Publish
```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
