## 知识图谱demo前端

### 项目开发


本地开发：`npm i`然后`npm start`即可。

打包是 `npm run build`。


### 项目中用到的技术栈、组件库

- `react`
- `mobx` 数据管理
- `less` css预处理器
- `react-router 4` 路由
- `axios` 发请求
- `antd` 组件库
- `eslint` 检查语法错误
- `prettier` 格式化代码
- `mock` 模拟请求数据

### src目录结构

```
├── index.js 入口文件
├── index.less 全局用的样式以及覆盖蚂蚁组件的样式
├── api 封装api接口，按模块划分为不同的文件
    ├── graph.js
    ├── ...
├── component 基础组件
├── image 图片文件
├── page 各个页面
    ├── Route.js 定义路由
    ├── store.js 集中所有的store
    ├── Graph 图谱
        ├── index.js
        └── index.less
    ├── ...
├── util 工具库

```
