---
title react后台项目初始化
---

# 项目初始化

## 项目搭建

- 创建项目

  ```
  npm init vite
  ```

- 设置项目名称、项目框架 `react` 等

- 引入 `react-redux` 、 `react-router-dom` 、`redux` 

  ```json
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.3.0",
    "react-redux": "^7.2.8",
    "redux": "^4.1.2"
  },
  ```

- 修改 `dev` 命令，代码如下：

  ```json
  "dev": "vite --host --port 3050 --open",
  ```

  其中：

  - `--port` 表示修改端口号，后面接空格加数字表示要修改的端口号
  - `--open` 表示运行成功后立即打开新页面

## 样式引入

引入 `reset.css` 初始化样式，步骤如下：

1. 引入

   ```
   yarn add reset.css
   ```

2. 使用

   在 `main.jsx` 入口文件引入使用

   ```jsx
   import "reset.css";
   ```

> 注意
>
> 样式的引入也是有一定的规范需要遵循，正确引入顺序为：
>
> 1. 样式初始化，如 `reset.css`
> 2. UI框架的样式
> 3. 全局的样式
> 4. 组件的样式
> 5. 组件 `App`
>
> 这样就不会有覆盖的风险

## 样式初始化

本项目使用 `sass` 样式预处理器，步骤如下：

1. 引入

   ```
   yarn add sass --save-dev
   ```

   其中，`-dev` 表示该依赖是只有在开发环境使用，正式打包时不会一起打包。有效减小包体积。

2. 创建文件

   创建一个 `global.scss` 文件

   ```scss
   $default-color: #ccc;
   
   body {
     user-select: none; // 取消文字选中
     color: $default-color;
   }
   
   img {
     // 不允许拖动图片
     -webkit-user-drag: none;
   }
   ```

3. 引入

   ```jsx
   import "reset-css";
   import "./assets/style/global.scss";
   import App from './App.jsx'
   ```

## 路径别名

### 配置别名

在 `vite.config.js` 文件中配置路径别名，代码如下：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

```

> 注意
>
> path 是 node 的一个变量，项目中已经有 node ，所以可以正常使用，但是如果是 TS 创建的项目会有报错。
>
> 解决方法为引入声明配置，如下：
>
> ```
> yarn add -D @types/node
> ```
>
> 如果下载后还是有报错，应该是 `vite` 的版本，上方引入的代码可以换为如下形式解决：
>
> ```js
> import * as path from "path";
> ```

### 添加提示

如果是 TS 创建的项目，还需要在 `tsconfig.json` 文件中的 `compilerOptions` 对象下的 `paths` 对象中配置提示。代码如下：

```json
{
  // ...
  "paths": {
    "@/*": [
      "src/*"
    ]
  }
}
```

## 样式模块化

在使用组件时如果采用全局导入的方式，会使得样式类名冲突，因此需要使用样式模块化的方式引入样式。步骤如下：

1. 创建模块化样式文件

   注意：其类名必须为 `xxx.module.scss`

   ```scss
   div {
     color: red;
   
     .box {
       color: skyblue;
     }
   }
   ```

2. 组件中导入

   ```jsx
   import styles from './index.module.scss'
   ```

   此时 `styles` 可以看作一个对象

3. 使用

   ```jsx
   export default function Test() {
     return (
       <div>
         Test
         <p className={styles.box}>aaaaa</p>
       </div>
     )
   }
   ```

## 组件库使用

使用 `Ant Design` 组件库，步骤如下：

1. 引入组件库和字体图标依赖

   ```
   yarn add antd
   yarn add @ant-design/icons
   ```

2. App 组件中引入使用

   ```jsx
   import React from 'react'
   import { Button } from 'antd';
   import { StepForwardOutlined } from '@ant-design/icons';
   
   export default function Test() {
     return (
       <div>
         <StepForwardOutlined />
         <Button type="primary">Primary Button</Button>
       </div>
     )
   }
   
   ```

> 注意
>
> 1. Antd5 版本无需引入样式文件也能正常渲染，4及4以下的版本需要引入样式文件，官网网址指路：[示例]([Ant Design of React - Ant Design](https://4x.ant.design/docs/react/introduce-cn))
>
>    ```jsx
>    import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
>    ```
>
> 2. Antd5 版本无需其他操作也能实现样式按需引入，4及4以下的版本按需引入需要做额外操作，官网文档指路：[按需引入]()
>
>    - 安装
>
>      ```
>      yarn add vite-plugin-style-import@1.4.1 -D
>      ```
>
>    - 在 `vite-config.js` 文件中设置按需引入代码
>
>      ```js
>      // ...
>      import styleImport, { AntdResolve } from 'vite-plugin-style-import'
>      
>      export default defineConfig({
>        // ...
>        plugins: [
>          react(),
>          styleImport({
>            resolves: [
>              AntdResolve()
>            ]
>          })
>        ]
>      })
>      ```
>
>    - 运行项目后发现报错，提示缺少 `less` ，安装 `less`
>
>      ```
>      yarn add less@2.7.1 -D
>      ```

## 路由配置

### 路由配置写法

#### 路由配置

创建路由：

```jsx
import App from "../App.jsx";
import Home from "../views/Home.jsx";
import About from "../views/About.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const baseRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default baseRouter;
```

入口文件中导入使用：

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
// import App from '@/App.jsx'
import Router from "@/router/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
```

`App.jsx` 根组件中设置占位组件：

```jsx
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      {/* 占位符组件，类似于窗口，用于展示组件，类似于router-view */}
      <Outlet />
    </>
  );
}

export default App;
```

> 踩坑提示
>
> 入口文件中 `Router` 作为组件来引入使用，必须要首字母大写，否则报错。

#### 编程式导航

```jsx
import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Link to="/home">Home</Link>
      <Link to="/about">about</Link>
      {/* 占位符组件，类似于窗口，用于展示组件，类似于router-view */}
      <Outlet />
    </>
  );
}
```

#### 重定向

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const baseRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* 用户访问的时候，重定向到home */}
        <Route path="/" element={<Navigate to="/home" />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
```

### 路由表写法

#### 路由配置

此时需要修改 `router/index.jsx` 中设置一个路由数组并导出：

```jsx
import Home from "../views/Home.jsx";
import About from "../views/About.jsx";
import { Navigate } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
];

export default routes;
```

由于不再导出组件，因此入口文件报错，需要恢复回来：

```jsx
import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

> 注意
>
> 路由需要外部包裹 `BrowserRouter` 的标签，写在入口文件中包裹 App 根组件即可。

在根组件中使用路由 `hook` 配置路由：

```jsx
import { Link, useRoutes } from "react-router-dom";
import routes from "./router";

function App() {
  const outlet = useRoutes(routes);

  return (
    <>
      <Link to="/home">Home</Link>
      <Link to="/about">about</Link>
    
      {outlet}
    </>
  );
}
```

#### 懒加载

通过 `react` 提供的 `lazy` 方法实现路由懒加载，配置方法如下：

```jsx
import { lazy } from "react";

const About = lazy(() => import("../views/About.jsx"));
```

然后运行报错，提示如下：

![1690889785463.png](https://img1.imgtp.com/2023/08/01/CvGhVzR7.png)

懒加载的写法，外层需要使用 `React` 的 `Suspense` 方法，该方法中有一个 `fallback` 属性，用于懒加载时组件未引入时显示的内容，可以是组件，也可以是 JSX 标签。代码如下：

```jsx
import React, { lazy } from "react";

const About = lazy(() => import("../views/About.jsx"));

const routes = [
  // ...
  // 懒加载需要配合Suspense属性使用
  {
    path: "/about",
    element: <React.Suspense fallback={<div>Loading...</div>}>
    <About />
    </React.Suspense>,
  },
];
```

#### 懒加载组件抽离

把懒加载的组件抽离出来方便复用，代码如下：

```jsx
const withLoadingComponent = (comp) => (
  <React.Suspense fallback={<div>Loading...</div>}>{comp}</React.Suspense>
);

const routes = [
  // ...
  {
    path: "/about",
    element: withLoadingComponent(<About />),
  },
];
```

使用时只需要传对应组件即可。

> 注意
>
> 在 TypeScript 中，需要设置组件类型为 `JSX.element`

### 路由嵌套

以路由表写法为例：做二级路由的步骤为：

1. 设置路由重定向到二级路由的默认路由
2. 在一级路由下的 `children` 属性设置二级路由

代码如下所属：

```jsx
import Home from "../views/Home.jsx";
import { Navigate } from "react-router-dom";
import React, { lazy } from "react";

const Vue = lazy(() => import("../views/Vue/index.jsx"));
const ReactJSX = lazy(() => import("../views/React/index.jsx"));

// 懒加载组件
const withLoadingComponent = (comp) => (
  <React.Suspense fallback={<div>Loading...</div>}>{comp}</React.Suspense>
);

const routes = [
  // 这里是重定向到二级路由 /vue，即页面打开默认显示 /vue 的内容
  {
    path: "/",
    element: <Navigate to="/Vue" />,
  },
  // 一级路由
  {
    path: "/",
    element: <Home />,
    // 二级路由
    children: [
      {
        path: "/vue",
        element: withLoadingComponent(<Vue />),
      },
      {
        path: "/react",
        element: withLoadingComponent(<ReactJSX />),
      },
    ],
  },
];
```

