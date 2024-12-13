# 项目初始化

## 项目创建

采用 `create-react-app` 创建 `react` 版项目。

```
npx create-react-app news
```

## 依赖引入

1. 引入初始化样式

   ```
   yarn add reset.css
   ```

3. 引入 CSS 预处理器

   ```
   yarn add sass sass-loader
   ```

4. 处理最大宽度

   ```js
   // 处理最大宽度
   (function () {
     const handleMax = function handleMax() {
       let html = document.documentElement,
         root = document.getElementById("root"),
         deviceW = html.clientWidth;
       root.style.maxWidth = "750px";
       if (deviceW >= 750) html.style.fontSize = "75px";
     };
     handleMax();
   })();
   ```

## 单位换算

引入依赖实现响应式布局：

```
yarn add lib-flexible
yarn add postcss-pxtorem
```

在src目录下index.js里引入[lib-flexible](https://so.csdn.net/so/search?q=lib-flexible&spm=1001.2101.3001.7020)

```javascript
import "lib-flexible";
```

修改[webpack](https://so.csdn.net/so/search?q=webpack&spm=1001.2101.3001.7020).config.js（这个文件在node_modules文件夹下的react-scripts文件夹下的config文件夹中）

先引入：

```javascript
const pxtorem = require('postcss-pxtorem');
```

然后找到下图位置添加如下代码（因为这里是三元运算符，所以要加两次）

```javascript
pxtorem({ rootValue: 75, unitPrecision: 5, propList: ['*'] })
```

![效果](https://pic.imgdb.cn/item/64d1ad9b1ddac507cc11a7cb.jpg)

## 路径别名

用 `create-react-app` 创建的 `react` 版项目路径别名配置需要先下载两个依赖：

```
yarn add react-app-rewired
yarn add customize-cra
```

下载完毕后在根目录下创建 `config-overrides` 用于配置别名，代码如下：

```js
const { override, addWebpackAlias } = require("customize-cra");

const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src/"),
  })
);
```

紧接着修改 `package.json` 文件中的 `scripts` 对象内的启动语句，代码如下：

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
},
```

现在重新运行，可以使用路径别名了。

## 组件库使用

本项目使用的是 `antd-mobile` 组件库。使用方法如下：

1. 引入组件库

   ```
   yarn add antd-mobile
   ```

2. 国际化配置

   ```js
   import React from "react";
   import ReactDOM from "react-dom/client";
   import App from "@/App";
   
   // 国际化语法包
   import { ConfigProvider } from "antd-mobile";
   import zhCN from "antd-mobile/es/locales/zh-CN";
   
   // ...
   
   const root = ReactDOM.createRoot(document.getElementById("root"));
   root.render(
     <React.StrictMode>
       <ConfigProvider locale={zhCN}>
         <App />
       </ConfigProvider>
     </React.StrictMode>
   );
   ```