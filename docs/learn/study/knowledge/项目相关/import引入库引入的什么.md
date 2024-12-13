# import引入库引入的是什么

## package.json重要字段

- `main` ：一般常用，浏览器和 Node 环境均生效
- `module-esm` ：规范入口，`Node` 无效
- `browser` ：浏览器环境入口
- `exports` ：可覆盖前面属性，定义 `import` 和 `require` 分别引入什么，Node 14.13后支持

## import引入模块机制

首先先谈谈寻找文件夹的机制。机制主要分以下两种情况：

1. 如果加了 `"."` 、`"/"` 这样的具体路径，那么会按照路径查找
2. 如果只写了模块名，则去 `node_modules` 中查找

`import` 引入整个文件夹肯定是不行的，实际上它引入的是一个文件。那么到底引入的是哪个文件呢？

## 模块引入的是哪个文件

首先会先判断引入的包有没有 `packjson` 字段，且是否有对应的控制字段，如果有，根据 `packjson` 的 `main` 等字段综合决定；没有则引入 `index.js` 。

### 浏览器环境

测试一下，在一个项目中初始化 `test` 文件夹，让其拥有 `package.json` 文件。

```bash
npm init -y
```

现在该文件夹下有 `index.js` 文件和 `package.json` 文件。新增一个 `index.module.js` 和 `index.broswer.js` 文件。分别全局导出一个对象。

```js
export default {
  msg: 'xxx'
}
```

在 `package.json` 文件中配置。

```json
{
  // ...
  "main": "index.js",
  "module": "index.module.js",
  "broswer": "index.broswer.js",
}
```

现在三者都有的情况，在浏览器环境下，通过 `import` 引入，它最终打印的顺序是：

1.  有 `broswer` 导出 `broswer` 的值
2. 无 `broswer` 导出 `module` 的值
3. 无 `module` 且无 `broswer` 导出 `main` 的值

### node环境

把每个 `js` 文件的导出修改一下，避免 `node` 环境报错。

```js
module.exports = {
  msg: 'xxx'
}
```

引入该文件。

```js
let test = require('./test')
console.log(test)
```

它最终打印结果是：

1. 有 `main` 导出 `main` 的值
2. 无 `mian` 导出 `index.js` 的值
3. 都没有则报错

### 总结

- 浏览器环境下，`import` 引入 `broswer` > `module` > `main` 
- `node` 环境下，`require` 引入 `main` ，其他设置无效，没有 `main` 等价于没有 `package.json` 

### 拓展

Node 14.13 后新增了一个 `export` ，在 `test` 文件夹中新增一个 `index.exports.js` 和 `index.style.js` 。

```js
// index.exports.js
export default {
  msg: 'exports'
}

// index.style.js
export default {
  msg: 'style'
}
```

在 `package.json` 文件中定义相关配置以覆盖前面的。

```js
{
  // ...
  "exports": {
    ".": {
      "import": "./index.exports.js"
    },
    "./style": {
      "import": "./index.style.js"
    }
  }
}
```

在之前没有 `exports` 时导出的是 `broswer` ，现在有了之后导出的是 `exports` 的值。

```js
import exports from 'test' // {msg: 'exports'}
import exportStyle from 'test/style' // {msg: 'style'}
```

若直接 `import` `test` 模块，走默认的 `.` ，同时支持路径定义引入。

## 成果检验

既然已经了解到了这些，不如现在看一下 `vue` 在导入时都 `import` 了些什么文件。

去往 `node_module` 文件夹，找到 `vue` 文件夹，查看其 `package.json` 文件。

```js
{
  "name": "vue",
  "version": "3.4.21",
  "description": "The progressive JavaScript framework for building modern web UI.",
  "main": "index.js",
  "module": "dist/vue.runtime.esm-bundler.js",
  "types": "dist/vue.d.ts",
  "unpkg": "dist/vue.global.js",
  "jsdelivr": "dist/vue.global.js",
  "files": [
    "index.js",
    "index.mjs",
    "dist",
    "compiler-sfc",
    "server-renderer",
    "jsx-runtime",
    "jsx.d.ts"
  ],
  "exports": {
    ".": {
      "import": {
        "types": "./dist/vue.d.mts",
        "node": "./index.mjs",
        "default": "./dist/vue.runtime.esm-bundler.js"
      },
    },
  }
  // ...
}
```

可以看到，它主要引入的是 `index.mjs` 文件里导出的内容。而 `index.mjs` 文件主要引入 `index.js` 文件的内容并导出。

```js
export * from './index.js'
```

而 `index.js` 文件则是判断当前的环境是开发环境还是生产环境，根据不同的环境导出不同模块的文件，两个文件的区别是压缩与否。

```js
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vue.cjs.prod.js')
} else {
  module.exports = require('./dist/vue.cjs.js')
}
```