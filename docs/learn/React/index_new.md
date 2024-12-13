# React

## 新版项目创建

下面来创建一个 REACT 项目

1. 首先登录[官网 (opens new window)](https://nodejs.org/en/)下载安装[NODEJS (opens new window)](https://nodejs.org/zh-cn/)最新版本

2. [Yarn (opens new window)](https://yarnpkg.com/)会缓存它下载的每个包所以无需重复下载
   ```txt
   npm install -g yarn@berry
   ```
3. 使用 [Create React App (opens new window)](https://create-react-app.dev/)安装 REACT 项目非常方便，下面来创建项目 tydumpling
   ```txt
   npm i -g create-react-app
   ```
4. 创建项目

   ```
   npx create-react-app 项目名称
   ```

5. 进入目录并启动项目

   ```txt
   cd 项目名称
   yarn start
   ```

### public 文件介绍

- `favicon.ico` ：网站图标
- `index.html` ：单文件项目的主文件，其中：
  - `<link rel="icon"` ：网站的图标
  - `<meta name="viewport"` ：移动端适配的头
  - `<meta name="theme-color"` ：安卓手机运行时浏览器搜索栏的颜色
  - `<meta name="description"` ：网站的描述
  - `<link rel="apple-touch-icon"` ：苹果手机创建桌面快捷方式时的图标
  - `<link rel="manifest"` ：应用加壳技术，加壳之后前端 H5 页面改后缀为 `.apk` 可下载到手机上使用（适用于简单的项目）
- `manifest.josn` ：应用加壳的配置

### src 文件介绍

- App.css -------- App 组件的样式
- App.js --------- App 组件
- App.test.js ---- 用于给 App 做测试
- index.css ------ 样式
- index.js ------- 入口文件
- logo.svg ------- logo 图
- reportWebVitals.js --- 页面性能分析文件(需要 web-vitals 库的支持)
- setupTests.js ---- 组件单元测试的文件(需要 jest-dom 库的支持)

### 开发工具

![“vscode logo”的图片搜索结果](data:image/png;base64,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)

建议使用 [VSCODE (opens new window)](https://code.visualstudio.com/)做为开发工具，需要安装的插件如下（点开链接后，点击 Install 按钮安装）

1. [Reactjs code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets)
2. [React Extension Pack](https://marketplace.visualstudio.com/items?itemName=jawandarajbir.react-vscode-extension-pack)
3. [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) react 代码片段插件

### 声明组件

#### 基本声明

下面在 index.js 入口文件中创建组件最简单的组件。下面的组件像 HTML 但只是像而已。它被称为 JSX 是一个 JavaScript 的语法扩展，它具有 JavaScript 的全部功能。

- 渲染后的内容将放在 `public/index.html` 中 ID 为 root 的标签中

```js
import React from "react";
import ReactDom from "react-dom";

ReactDom.render(<div>tydumpling</div>, document.querySelector("#root"));
```

在 JSX 中可以使用 JS 的功能，要求使用花扩号包裹

```js
const name = "tydumpling";
ReactDom.render(<div>{name}</div>, document.querySelector("#root"));
```

#### 函数声明

使用函数返回组件，渲染组件时可以传递参数供组件使用

```js
const App = (props) => {
  return <div>{props.name}</div>;
};

ReactDom.render(App({ name: "tydumpling" }), document.querySelector("#root"));
```

调用组件也可以直接使用标签形式，参数以属性形式传递

- 要求首字母大写

```js
import React from "react";
import ReactDom from "react-dom";
const App = (props) => {
  return <div>{props.name}</div>;
};

ReactDom.render(<App name="tydumpling.com" />, document.querySelector("#root"));
```

#### 类的声明

我们知道 JS 中的类也是函数，REACT 也可以使用类的方式声明组件，但要保证返回 JSX 组件标签

```js
import React, { Component } from "react";
import ReactDom from "react-dom";
class App {
  constructor(props) {
    this.props = props;
  }
  render() {
    return <div>{this.props.name}</div>;
  }
}

ReactDom.render(
  new App({ name: "tydumpling" }).render(),
  document.querySelector("#root")
);
```

如果继承了 Component 基类，会自动绑定参数到 props

```js
import React, { Component } from "react";
import ReactDom from "react-dom";
class App extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

ReactDom.render(
  new App({ name: "tydumpling" }).render(),
  document.querySelector("#root")
);
```

更好的是，当继承了 Component 基类

- 可以使用标签形式调用组件
- 系统会自动将标签参数绑定到属性 props
- 注意要求首字母大写

```js
import React, { Component } from "react";
import ReactDom from "react-dom";
class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return <div>{this.props.name}</div>;
  }
}

ReactDom.render(<App name="tydumpling" />, document.querySelector("#root"));
```

基类会帮助我们绑定数据到 props，所以不写构造函数也可以正常执行

```js
import React, { Component } from "react";
import ReactDom from "react-dom";
class App extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

ReactDom.render(<App name="tydumpling" />, document.querySelector("#root"));
```

#### 组件嵌套

下面 App 组件内部引入了 Hd 组件

```js
import React, { Component } from "react";
import { render } from "react-dom";

class Hd extends Component {
  render() {
    return <div>Hd组件: {this.props.name} </div>;
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Hd name="tydumpling.com" />
        App: {this.props.name}
      </div>
    );
  }
}
render(<App name="tydumpling" />, document.getElementById("root"));
```

#### 根组件

根据件就像 HTML 标签中的 **html** 一样，所有其它标签都在它的里面。根组件也是这个特点，在里面构建不同组件产生不同界面。

组件一般都是独立的文件，下面创建 App.js 文件构建根组件

```js
import React, { Component } from "react";
export default class App extends Component {
  render() {
    return <div>tydumpling</div>;
  }
}
```

在入口文件中导入组件并渲染

```js
import React, { Component } from "react";
import { render } from "react-dom";
import App from "./App";
render(<App />, document.querySelector("#root"));
```

#### 注释规范

组件中的注释使用 JS 注释规范，因为是 JS 所以要使用花扩号包裹。

```js
class App extends Component {
  render() {
    return (
      <div>
        {/* tydumpling */}
        {this.props.name}
      </div>
    );
  }
}
```

### 样式处理

下面介绍多种样式的处理方式

#### 行级样式

REACT 中定义样式也非常简单，下面是定义 STYLE 行样式

```js
class App extends Component {
  render() {
    return <div style={{ color: "red" }}>App: {this.props.name}</div>;
  }
}
render(<App name="tydumpling" />, document.getElementById("root"));
```

以对象形式声明样式

```js
class App extends Component {
  render() {
    const style = {
      backgroundColor: "red",
      color: "blue",
    };
    return <div style={style}>tydumpling</div>;
  }
}
render(<App name="tydumpling" />, document.getElementById("root"));
```

#### 类的声明

下面来体验类样式的定义

1. 组件同级目录定义 App.css，内容如下
   ```css
   .bg-color {
     background: red;
   }
   ```
2. 在 index.js 中使用 className 属性来声明类
   ```js
   import React, { Component } from "react";
   import { render } from "react-dom";
   import "./App.css";
   class App extends Component {
     render() {
       return <div className="bg-color">App: {this.props.name}</div>;
     }
   }
   render(<App name="tydumpling" />, document.getElementById("root"));
   ```

当然也可以使用 JS 程序计算，下面是使用三元表达式的计算

```js
class App extends Component {
  render() {
    return (
      <div className={true ? "bg-color" : "hd"}>App: {this.props.name}</div>
    );
  }
}
```

#### 第三方库

**classnames**

[classnames (opens new window)](https://www.npmjs.com/package/classnames)是一个动态设置样式类的库，比如不同用户组使用不同样式。

首先来安装库

```txt
npm i classnames
```

在 index.js 声明的组件中使用

```js
import className from "classnames";
import "./App.css";
class App extends Component {
  render() {
    return (
      <div className={className("bg-color", { hd: true })}>
        App: {this.props.name}
      </div>
    );
  }
}
render(<App name="tydumpling" />, document.getElementById("root"));
```

**styled-components**

使用社区提供的第三方库来控制样式，下面是使用 [styled-components (opens new window)](https://www.npmjs.com/package/styled-components)组件来控制样式

安装扩展包

```txt
npm i styled-components
```

下面在组件中使用

```js
...

//声明样式组件Wrapper 最终渲染成section
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

class App extends Component {
  render() {
    return (
      <Wrapper>
        <div>App: {this.props.name}</div>
      </Wrapper>
    );
  }
}
render(<App name="tydumpling" />, document.getElementById("root"))
```

#### 样式模块化

1. 通过下载 `less` 、`scss` 等预处理器来设置单独的样式模块
   ```scss
   .hello {
     .title {
       color: red;
     }
   }
   ```
2. 通过 `module` 关键词做模块化操作
   - 样式文件中间添加 `.model` 关键字
     ```css
     index.module.css
     ```
   - 引入的时候使用关键字接收
     ```javascript
     import hello from "./index.module.css";
     ```
   - 使用的时候通过 `关键字.类名` 的方式使用
     ```jsx
     <div className={hello.title}></div>
     ```

### 实例操作

### axiox 请求

#### 跨域处理

1. 配置 `proxy` 代理

   在 `package.json` 文件中配置代理，通过服务器没有同源策略的特性避免跨域的问题，其参数是自己需要请求的服务器 IP 与端口

   ```json
   {
     // ...
     "proxy": "http://localhost:5000/"
   }
   ```

   说明：

   1. 优点：配置简单，前端请求资源时可以不加任何前缀。
   2. 缺点：不能配置多个代理。
   3. 工作方式：上述方式配置代理，当请求了 3000 不存在的资源时，那么该请求会转发给 5000 （优先匹配前端资源）

2. 配置代理文件

   1. 第一步：创建代理配置文件

      在 src 下创建配置文件：`src/setupProxy.js`

   2. 编写 setupProxy.js 配置具体代理规则：

      ```javascript
      const proxy = require("http-proxy-middleware"); // react18之前
      const { createProxyMiddleware } = require("http-proxy-middleware"); // react18之后

      module.exports = function (app) {
        app.use(
          proxy("/api1", {
            //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
            target: "http://localhost:5000", //配置转发目标地址(能返回数据的服务器地址)
            changeOrigin: true, //控制服务器接收到的请求头中host字段的值
            /*
                changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
                changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
                changeOrigin默认值为false，但我们一般将changeOrigin值设为true
            */
            pathRewrite: { "^/api1": "" }, //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
          }),
          proxy("/api2", {
            target: "http://localhost:5001",
            changeOrigin: true,
            pathRewrite: { "^/api2": "" },
          })
        );
      };
      ```

   说明：

   1. 优点：可以配置多个代理，可以灵活的控制请求是否走代理。
   2. 缺点：配置繁琐，前端请求资源时必须加前缀。
