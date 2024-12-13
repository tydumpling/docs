# Vue项目打包后首页一片空白解决办法和具体原因总结

## 打包后的dist目录下的文件引用路径不对

`vue` 项目中，`public` 内的文件是不会打包直接放入 `dist` 文件夹根目录内，其余文件编译后放入对应的文件夹内，如 `css` 、`js` 、`img` 文件夹。

字段 `publicPath` 就是打包后静态资源的路径。不设置或者设置为 `/` 则是绝对路径，以根目录为基准路径进行拼接，例如：

![i9fztc.png](https://i.328888.xyz/2023/04/27/i9fztc.png)

而部署的文件夹根目录没有 `js` 文件，该 `js` 文件夹都在部署好的 `dist` 文件夹内，因此找不到资源文件。

设置为 `./` 则改为 **相对路径** ，以打包好的 `dist` 文件为根路径，选择其根目录下的 `js` 文件，例如：

![i9yyvF.png](https://i.328888.xyz/2023/04/27/i9yyvF.png)

![i9yDIQ.png](https://i.328888.xyz/2023/04/27/i9yDIQ.png)

此时能够访问到资源，页面也能正常渲染，说明 `publicPath` 当前目录即打包后的 `index.html` 的当前目录，即 `dist` 目录。

可以通过另外一个例子证明 “ `dist` 目录是根目录”，把 `publicPath` 设为 `../` ，打包后效果如下：

![i9AHGV.png](https://i.328888.xyz/2023/04/27/i9AHGV.png)

最后，放上简单版项目打包配置：

- `publicPath` ：打包根路径

- `outputDir` ：打包后文件夹名称，默认为 `dist` 

- `productionSourceMap` ：打包后每个js文件都有一个map文件

  `map` 文件的作用：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。 有了 `map` 就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。

  改成 `false` 后 所有打包生成的 `map` 文件都没有了，大大减小打包包体积。

- `disableHostCheck` ：`Vue` 项目 `invalid host header` 报错。

  > 注意：
  >
  > 在 `webpack 5` 中 `disableHostCheck` 应该被遗弃了，需将
  >
  > ```js
  > disableHostCheck:true
  > ```
  >
  > 替换为
  >
  > ```js
  > historyApiFallback: true,
  > allowedHosts: “all”,
  > ```

```js
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  publicPath: './',
  outputDir: 'client',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
  }
}
```

## 路由模式

`Vue` 打包默认是哈希模式 `hash` ，如果改为 `history` 历史模式，则需要服务器端加上一个覆盖所有情况的候选资源；如果 `URL` 匹配不到任何静态资源，则返回一个依赖页面 `index.html` 。

## 高级语法无法编译

部分低端浏览器无法适应高级 `es6` 语法，因此报错。解决方法：

1. 安装 `babel` 依赖

   ```js
   npm install --save-dev babel-preset-es2015
   npm install --save-dev babel-preset-stage-3
   ```

2. 创建 `.babelrc` 文件，配置转码规则（即把 `es6` 高级语法转为 `es5` 语法）

   ```js
   {
   	// 此项指明，转码的规则
   	"presets": [
   		// env项是借助插件babel-preset-env，下面这个配置说的是babel对es6,es7,es8进行转码，并且设置amd,commonjs这样的模块化文件，不进行转码
   		["env", { "modules": false }],
   		// 下面这个是不同阶段出现的es语法，包含不同的转码插件
   		"stage-2"
   	],
   	// 下面这个选项是引用插件来处理代码的转换，transform-runtime用来处理全局函数和优化babel编译
   	"plugins": ["transform-runtime"],
   	// 下面指的是在生成的文件中，不产生注释
   	"comments": false,
   	// 下面这段是在特定的环境中所执行的转码规则，当环境变量是下面的test就会覆盖上面的设置
   	"env": {
   		// test 是提前设置的环境变量，如果没有设置BABEL_ENV则使用NODE_ENV，如果都没有设置默认就是development
   		"test": {
   			"presets": ["env", "stage-2"],
   			// instanbul是一个用来测试转码后代码的工具
   			"plugins": ["istanbul"]
   		}
   	}
   }
   ```

