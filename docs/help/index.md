---
title 有用的帮助
---
# 有用的帮助
前端开发利器，有了它们能够让我们事半功倍！

## Vue

- 源码架构翻译：[Vue Template Explorer (vuejs.org)](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PkhlbGxvIFdvcmxkPC9kaXY+XHJcbjxkaXY+e3thfX08L2Rpdj5cclxuPGRpdj57e2J9fTwvZGl2PlxyXG48ZGl2IDpjbGFzcz1cImNsYXNzTmFtZVwiPmI8L2Rpdj5cclxuPGRpdiA6Y2xhc3M9XCJjbGFzc05hbWVcIj57e2J9fTwvZGl2PiIsIm9wdGlvbnMiOnt9fQ==)

## TypeScript

- 在线 JSON 转 TS：[JSON to TypeScript (transform.tools)](https://transform.tools/json-to-typescript)

## 正则

- 在线正则校验：[正则表达式在线测试](https://c.runoob.com/front-end/854/)
- 正则转图形：[正则转图形](https://regexper.com/)

## 其他

- ast语法：[ast语法](https://astexplorer.net/)
- gif录制：[ScreenToGif](https://www.screentogif.com/)
- 文字生成拼音：[pinyin](https://pinyin.js.org/)
- clip-path在线生成工具：[clip-path](https://www.jiangweishan.com/tool/clippy/)
- svg滤镜：[svg-filter](https://yoksel.github.io/svg-filters/#/)
- Css与HTML语法查询：[Can I use](https://caniuse.com/)

## 调试

### H5调试

- vConsole

  这个插件有点像微信小程序的调试插件，不过功能更丰富，可以查看控制台打印、网络请求、本地存储等。

  使用方法如下：

  ```js
  let consoleScript = document.createElement("script");
  consoleScript.src = "https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js";
  consoleScript.onload = function () {
    new VConsole()
  }
  document.head.appendChild(consoleScript);
  ```

  通过 CDN 引入在线模块即可。

  效果如下所示：

  [![pCTqQCd.jpg](https://s1.ax1x.com/2023/07/19/pCTqQCd.jpg)](https://imgse.com/i/pCTqQCd)

- eruda

  在项目的`index.html`文件里加入下面这段代码

  ```html
  <script src="http://eruda.liriliri.io/eruda.min.js"></script>
  <script>
      eruda.init();
  </script>
  ```

  项目启动后，在手机右下角就会出现灰色的控制台。效果如下所示：

  [![pC7kF8x.png](https://s1.ax1x.com/2023/07/19/pC7kF8x.png)](https://imgse.com/i/pC7kF8x)
