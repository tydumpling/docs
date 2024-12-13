---
title 尚义通项目创建
---

# 项目创建

项目正式地址：[尚医通]([tydumpling医院 (gitee.io)](http://duyidao.gitee.io/doctor/)) 。

## 前置工作

### SVG转换

把图片转为 SVG 格式，在线转换网址推荐：[svg转换]([在线转换图像文件 (aconvert.com)](https://www.aconvert.com/cn/image/)) 。

### 默认样式清除文件

前往 NPM 官网搜索 [reset.scss](https://www.npmjs.com/package/reset.scss) 清除默认样式文件，复制代码保存在 `style` 文件夹下。

## 项目配置

### 浏览器自动打开

找到 package.json 配置文件：

```json
"scripts": {
  "dev": "vite --open",
  //...
 },
```

### src 别名的配置

找到 vite.config.ts 配置文件。

**如果红色语法提示请安装@types/node 是 TypeScript 的一个声明文件包，用于描述 Node.js 核心模块和常用的第三方库的类型信息**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
 plugins: [vue()],
 resolve: {
  alias: {
   "@": path.resolve(__dirname, 'src')
  }
 }
})
```

找到 `tsconfig.json` 配置文件,找到配置项 compilerOptions 添加配置,这一步的作用是让 IDE 可以对路径进行智能提示：

```js
"baseUrl": ".",
"paths": {
   "@/*": ["src/*"]
}
```

### 清除默认样式

1. 下载 `scss` 样式预处理器

   ```
   yarn add scss
   ```

2. 入口文件引入清除默认样式文件

   ```js
   import './style/reset.scss'
   ```

## 技术运用

### scrollIntoView

#### 前置知识

`scrollIntoView` 是一个可用于网页中元素滚动的 JavaScript 方法。它使得指定的元素滚动到当前浏览器窗口的可视区域内。

使用 `scrollIntoView` 方法可以滚动具有滚动条的父容器中的元素，或者在页面上完整滚动到包含指定元素的父级容器。

以下是 `scrollIntoView` 方法的基本用法：

```js
element.scrollIntoView();
```

其中 `element` 是需要滚动到可视区域的元素。

你还可以提供一个参数对象来指定滚动行为的更多选项。例如，你可以使用以下代码滚动到具有平滑动画效果的元素：

```js
element.scrollIntoView({ behavior: 'smooth' });
```

`behavior` 属性可以是 ‘auto’、‘smooth’ 或者可选的 `scrollOptions` 对象。‘auto’ 将使用默认的滚动行为，‘smooth’ 将以平滑的动画方式滚动，`scrollOptions` 对象可以提供更多自定义选项。

> 注意
>
> `scrollIntoView` 方法可用于较新版本的现代浏览器。如果目标浏览器需要支持较老的浏览器或移动设备，请确保检查其兼容性并提供备用方案。

#### 使用

```js
const handleNavFn = (i: number) => {
  activeIndex.value = i;
  // 获取右侧科室h1标题
  let allH1 = document.querySelectorAll("h1");
  // 滚动到对应位置
  allH1[i].scrollIntoView({
    behavior: "smooth", // 过度动画效果
    block: "end",
  });
};
```

获取到相应的DOM 元素，点击后通过 `scrollIntoView` 方法实现滚动。

### qrCode

#### 前置知识

QRCode.js 是一个用于生成二维码的 JavaScript 库。主要是通过获取 DOM 的标签,再通过 HTML5 Canvas 绘制而成,不依赖任何库。

------

基本用法

```html
<div id="qrcode"></div>
<script type="text/javascript">
new QRCode(document.getElementById("qrcode"), "https://www.runoob.com");  // 设置要生成二维码的链接
</script>
```

或者使用一些可选参数设置：

```js
var qrcode = new QRCode("test", {
    text: "https://www.runoob.com",
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});
```

同样我们可以使用以下方法：

```js
qrcode.clear(); // 清除代码
qrcode.makeCode("https://c.runoob.com"); // 生成另外一个二维码
```

#### 使用

- 引入

  ```
  yarn add qrcode
  ```

- 注册使用

  ```js
  import QRCode from "qrcode";
  ```

- 生成二维码

  ```js
  imgUrl.value = await QRCode.toDataURL(res.data.codeUrl);
  ```

  注意他是异步方法，返回 Promise，因此通过 `await` 或 `.then()` 获取数据