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

pictures
<img width="1859" height="864" alt="image" src="https://github.com/user-attachments/assets/ecd4d20e-6cd3-4634-a4fb-2101ca19cb7b" />
<img width="1065" height="677" alt="image" src="https://github.com/user-attachments/assets/c5dab75f-1931-44ad-81ac-f1b0e08d44ba" />
<img width="1862" height="1116" alt="image" src="https://github.com/user-attachments/assets/0d1dc75c-eec5-410f-a745-0096b68ea2e4" />
