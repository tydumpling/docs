# path

`path` 模块是 `node.js` 的内置模块，导入标准命名是 `node:path` ，不过 `node:` 是可以省略的，用于解析文件路径操作。下面介绍常用属性和方法。

## join

根据不同操作系统中的路径分隔符，组成新的文件路径

示例代码：

```js
import path from "path";

console.log(path.join("./src/abc", "../", "module", "app.ts")); // src/module/app.ts

console.log(path.join("src", "module", "../app.ts")); // src/app.ts
```

> 注意：
>
> 凡是涉及到路径拼接的操作，都要使用 `path.join()` 方法进行处理。不要直接使用 + 进行字符串的拼接。

## basename

返回文件名中最后部分，一般是文件名，经常通过这个方法获取路径中的文件名。语法格式如下：

```js
path.basename(path, [ext]);
```

- `path <string>` 必选参数，表示一个路径的字符串
- `ext <string>` 可选参数，表示文件扩展名
- 返回： `<string>` 表示路径中的最后一部分

示例代码：

```js
import path from "path";

console.log(path.basename("./src/module/app.ts")); //app.ts
console.log(path.basename("./src/module/app.ts", ".ts")); //app
```

## extname

返回文件名的扩展名，可以获取路径中的扩展名部分，语法格式如下：

```js
path.extname(path);
```

- `path <string>` 必选参数，表示一个路径的字符串
- 返回： `<string>` 返回得到的扩展名字符串

示例代码：

```js
console.log(path.extname("/src/module/app.ts")); //.ts
```

## \_\_dirname

获取当前脚本所在目录，这是内置函数，不需要 `require` ，不了解可以看 **模块管理** 章节

```js
console.log(__dirname);
```

## \_\_filename

当前脚本的路径

```js
console.log(__filename);
```

## dirname

返回文件中的目录部分

```js
console.log(path.dirname("./src/module/app.ts")); //./src/module
```

## parse

获取文件的详细信息

```txt
import path from 'path'
console.log(path.parse('/src/module/app.ts'));
```

结果如下

```txt
{
  root: '/',
  dir: '/src/module',
  base: 'app.ts',
  ext: '.ts',
  name: 'app'
}
```

## format

这是 parse 的反函数，将对象转换为路径字符串

```txt
import path from 'path'
console.log(path.format(path.parse(__dirname)))
```

## isAbsolute

判断路径是否是绝对路径

```txt
console.log(path.isAbsolute('./src/module/app.ts')) //false

console.log(path.isAbsolute('/etc')) //true
```

## resolve

根据不同操作系统中的路径分隔符，返回绝对路径的文件

```js
console.log(path.resolve("./src", "module", "app.ts")); /// Users/hd/code/test/src/module/app.ts
```

## 案例

把一个包含内敛式 css 和 js 的 html 文件拆分其 css 样式和 js。

案例代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>index首页</title>
    <!-- <link rel="stylesheet" href="./index.css" /> -->
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
        background-image: linear-gradient(to bottom right, red, gold);
      }

      .box {
        width: 400px;
        height: 250px;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 6px;
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        box-shadow: 1px 1px 10px #fff;
        text-shadow: 0px 1px 30px white;

        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 70px;
        user-select: none;
        padding: 0 20px;

        /* 盒子投影 */
        -webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left
              bottom, from(transparent), color-stop(0%, transparent), to(rgba(250, 250, 250, 0.2)));
      }
    </style>
  </head>

  <body>
    <div class="box">
      <div id="HH">00</div>
      <div>:</div>
      <div id="mm">00</div>
      <div>:</div>
      <div id="ss">00</div>
    </div>

    <!-- <script src="./index.js"></script> -->
    <script>
      window.onload = function () {
        // 定时器，每隔 1 秒执行 1 次
        setInterval(() => {
          var dt = new Date();
          var HH = dt.getHours();
          var mm = dt.getMinutes();
          var ss = dt.getSeconds();

          // 为页面上的元素赋值
          document.querySelector("#HH").innerHTML = padZero(HH);
          document.querySelector("#mm").innerHTML = padZero(mm);
          document.querySelector("#ss").innerHTML = padZero(ss);
        }, 1000);
      };

      // 补零函数
      function padZero(n) {
        return n > 9 ? n : "0" + n;
      }
    </script>
  </body>
</html>
```

### 读取文件

```js
const fs = require("fs");
const path = require("path");

const styleReq = /<style>[\s\S]*<\/style>/; // css正则
const scriptReq = /<script>[\s\S]*<\/script>/; // js正则

fs.readFile(path.join(__dirname, "./clock.html"), "utf8", (err, res) => {
  if (err) return console.log("文件读取失败");
  console.log(res);
});
```

### 分离 css 样式

```js
function resolveCss(params) {
  // 正则获取符合条件的内容，是一个数组形式
  const res = styleReq.exec(params);

  // 提取出的字符串进行字符串替换操作，替换开头和结尾的两个标签
  const newRes = res[0].replace("<style>", "").replace("</style>", "");

  // 写入文件
  fs.writeFile(path.join(__dirname, "./new.css"), newRes, "utf8", (err) => {
    console.log(err);
  });
}
```

### 分离 js

```js
function resolveJs(params) {
  // 正则获取符合条件的内容，是一个数组形式
  const res = scriptReq.exec(params);

  // 提取出的字符串进行字符串替换操作，替换开头和结尾的两个标签
  const newRes = res[0].replace("<script>", "").replace("</script>", "");

  fs.writeFile(path.join(__dirname, "./new.js"), newRes, "utf8", (err) => {
    console.log(err);
  });
}
```

### 注意点

1. `fs.writeFile()` 方法只能用来创建文件，不能用来创建路径
2. 重复调用 `fs.writeFile()` 写入同一个文件，新写入的内容会覆盖之前的旧内容
