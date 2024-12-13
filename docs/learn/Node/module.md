# 模块化

## 基本概念

模块化是指解决一个复杂问题时，自顶向下逐层把系统划分成若干模块的过程。对于整个系统来说，模块是可组合、分解和更换的单元。

> `node.js` 使用 `common.js` 模块管理，`common.js` 是 2009 年制定的模块标准。
>
> 你可能会奇怪为什么不使用 ES6 module，因为 `node.js` 推出时 `javascript` 还没有 `ES6 Module` 。

**模块特点**

- 每个文件都被视为一个模块。
- 使用 **module.exports** 导出模块，使用 **require** 导入模块。
- 建议将文件底部定义模块导出，这样会清楚的知道模块哪些内容被导出了。
- 导入时可以使用 `Js` 的解构获取具体的 `api` 。
- 使用 `module.exports` 导出模块，而不是直接使用 `exports` 导出模块。

### 模块分类

我们不能将所有功能写在一个文件中，所以项目要使用模块化管理，你可以将模块理解为一个个独立的文件。使用模块思想可以更好的组织我们的项目代码，因为模块是独立文件所以可以更好的复用代码。

`nodejs` 中有以下几种模块类型

- 内置模块（内置模块是由 Node.js 官方提供的，例如 fs、path、http 等）
- 自定义模块（用户创建的每个 .js 文件，都是自定义模块）
- 第三方模块（由第三方开发出来的模块，并非官方提供的内置模块，也不是用户创建的自定义模块，使用前需要先下载）

### 模块定义

模块的定义非常简单，任何 js 文件都可以是模块。

下面我们来编写第一个模块 `hd.js` ，他与我们的普通 `js` 文件无异，但在 `nodejs` 中他就是一个模块。

```js
function sum(a, b) {
  return a + b;
}

console.log("sum.js module");
```

### 模块加载

导入自定义的模块：使用 `require` 函数通过路径导入模块

- 模块的文件扩展名 .js 是可以省略的
- 导入的模块会自动执行

```js
require("./hd.js");
```

导入官方或第三方模块：使用 `require` 函数通过名称导入模块

```js
require("fs");
require("moment");
```

> 注意：
>
> 使用 `require()` 方法加载其它模块时，会执行被加载模块中的代码。

### 模块目录

当不指定导入文件的路径时，`node` 会自动导入模块。

执行下面命令可以得到，`node` 会从哪些目录中尝试找到模块

```js
console.log(module.paths);
```

结果为

```js
[
  "/Users/hd/code/node/node_modules",
  "/Users/hd/code/node_modules",
  "/Users/hd/node_modules",
  "/Users/node_modules",
  "/node_modules",
];
```

## 模块管理

实际开发中我们只想提供模块中的某些功能，这就需要使用 **module.exports** 向外部提供接口。

### 作用域

每个模块文件拥有独立的作用域，下面 a.js 与 b.js 模块都定义了 name 变量，因为有独立作用域，所以不会被覆盖。这个概念类似于 javascript 的函数与块作用域。

> 使用模块作用域，就不用担心模块中同名变量或函数的冲突问题

a.js

```js
const name = "a.js";
console.log(name);
```

b.js

```js
const name = "b.js";
console.log(name);
```

index.js

```js
require("./a.js");
require("./b.js");
```

输出结果为

```js
a.js;
b.js;
```

### 导出方式

在每个 .js 自定义模块中都有一个 module 对象，它里面存储了和当前模块有关的信息，打印如下：

![shili](https://s1.ax1x.com/2023/02/10/pSfs9Ts.png)

我们可以有多种方式导出模块

**默认导出**

默认情况下，**module.exports** 导出的是一个空对象，通过使用 **module.exports** 将自定义模块 `hd.js` 的 `sum` 接口向外部提供

```js
function sum(a, b) {
  return a + b;
}

console.log("sum.js module");

module.exports = sum;
```

然后在 `index.js` 中使用使用该模块

- 这是默认导出模块，所以可以使用任何变量来接收，`const sum` 可以换为 `const hd`

```js
const sum = require("./hd.js");

console.log(sum(1, 3));
console.log(sum(3, 5));
```

**属性导出**

通过 exports 属性导出

```js
module.exports.sum = (a, b) => a + b;
```

使用的时候要像这样

```js
const hd = require("./hd");
console.log(hd.sum(1, 4));
```

**直接导出**

下面是直接将函数导出

```js
module.exports = (a, b) => a + b;
```

**对象导出**

也可以导出的接口放在对象中统一导出

```js
const sum = (a, b) => a + b;
const webname = "houdunren.com";
module.exports = {
  sum,
  webname,
};
```

使用的时候可以使用结构语法获取接口

```js
const { webname, sum } = require("./hd");
console.log(sum(1, 4), webname);
```

### module.exports 与 exports

通过对模块的包装函数理解，最终模块导出使用的是 module.exports 对象

```js
(function (exports, require, module, __filename, __dirname) {
  //模块文件代码
});
```

所以我们可以简化导出，省略掉 module 前缀

```js
const sum = (a, b) => a + b;
exports.sum = sum;
```

使用时也没有区别

```js
const { sum } = require("./hd");
console.log(sum(1, 4));
```

但是因为 node.js 最终导出是使用 module.exports 对象的，如果直接使用 exports 导出一个对象，这时 exports 变量就不与 module.exports 使用相同的内存引用，就不会导出成功。

下面的写法将不会正确导出

```js
const sum = (a, b) => a + b;
exports = { sum };
```

而应用使用这样，因为 nodejs 内部最终使用的是 module.exports 变量

```js
const sum = (a, b) => a + b;
module.exports = { sum };
```

你可以使用 vscode 的断点调试查看到清晰的结果

![image-20230109171037093](https://doc.houdunren.com/assets/img/image-20230109171037093.3c7d81c8.png)

**使用误区**

导入模块时，得到的永远是 `module.exports` 指向的对象，如果前一行代码 `export` 添加属性，后一行代码 `module.exports` 导出对象， `module.exports` 会指向新的对象空间。

> 总结：
>
> 1. 默认情况下，`exports` 和 `module.exports` 指向同一个对象。最终共享的结果，还是以 `module.exports` 指向的对象为准。因此 `exports` 导出对象会失效。
> 2. 建议不要在同一个模块中同时使用 `exports` 和 `module.exports`

### 包装函数

其实 node.js 会将模块放在以下函数中，这就是为什么我们可以在模块文件中使用 module 等功能。

```js
(function (exports, require, module, __filename, __dirname) {
  //模块文件代码
});
```

### 模块缓存

Commonjs 加载的模块会被缓存起来，再有文件使用该模块时将从缓存中获取

```js
console.log(require.cache);
```

下例中的 hd.js 模块被 index.js 第一次 require 时就会缓存了，在第二次 require 时直接使用缓存的模块，所以两次打印结果都是 houdunren.com。

hd.js

```js
class Hd {
  name = "向军大叔";

  setName(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

module.exports = new Hd();
```

index.js

```js
const obj1 = require("./hd.js");

obj1.setName("houdunren.com");
console.log(obj1.getName());

const obj2 = require("./hd.js");
console.log(obj2.getName());
```

输出结果

```js
houdunren.com;
houdunren.com;
```

你可以使用 vscode 的断点调试，更直观的体验到结果

- 第二次的 require，在使用单步进入时并不会进入 hd.js 内部，只有第一次的 require 会进入 hd.js
- 同时可以在变量监控中查看到缓存的模块

![image-20230109163241811](https://doc.houdunren.com/assets/img/image-20230109163241811.527b2213.png)

为了解决上面的问题，hd.js 不要导出对象实例，而是单独的类

```js
class Hd {
  name = "向军大叔";

  setName(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

module.exports = Hd;
```

然后在 index.js 中使用时 new 出不同的实例即可

```js
const Hd = require("./hd.js");

const obj1 = new Hd();
obj1.setName("obj1");
console.log(obj1.getName());

const obj2 = new Hd();
console.log(obj2.getName());
```

### JSON

common.js 可以支持 JSON 文件的导入，下面是 hd.json 的内容

```txt
{
	"name": "后盾人",
	"url": "https://www.houdunren.com"
}
```

在 index.js 导入使用

```txt
const data = require('./hd.json')
console.log(data)
```

输出结果

```txt
{ name: '后盾人', url: 'https://www.houdunren.com' }
```

## ES6 Module

早期 javascript 没有模块功能，所以 node.js 使用了 common.js，不过从 ES 2015 推出了 Js 模块标准简称 ESM，NodeJs 13 开始支持了 ES6 Module。使用 ES6 模块标准，可以让我们在编写 Node、Vue、React 使用统一的模块操作方法。

下面定义 hd.mjs 支持 ESM 的模块文件

```js
const sum = (a, b) => a + b;

export default sum;
```

然后在 index.mjs 中使用 ESM 语法导入模块

```js
import sum from "./hd.mjs";

console.log(sum(4, 2));
```

要使用 ES6 模块管理请在 **package.json** 定义 **type** 属性。

- 如果编写的是 **.ts** 文件，就不要设置 **type** 属性

```js
{
	"type": "module",
	...
}
```

### 读取 JSON

读取 JSON 文件需要在 tsconfig.json 中定义 **resolveJsonModule** 选项

```js
{
  "compilerOptions": {
    ...
    "resolveJsonModule": true
  },
  "include": ["./**/*"]
}
```

这样我们就可以在文件中引入 JSON 了

```js
import data from "./hd.json";
```

## 第三方模块

我们在开发时不可能编写所有的功能，所以要使用包管理工具，安装 [npmjs.com](opens new window) 网站上的包。

当安装 **Node.js** 后已经内置了 **npm** 这个包管理命令，我们可以使用 **Npm** 下载、删除、更新、发布软件包。当然也可以使用 yarn 或 pnpm 命令管理第三方扩展包。
